<?php

class ModerationFlag {
    private $db;
    private $table = 'moderation_flags';
    private $logsTable = 'moderation_logs';

    public function __construct($db) {
        $this->db = $db;
    }

    /**
     * Get summary counts for top cards on Admin Moderation dashboard
     */
    public function getSummaryCounts() {
        $sql = "SELECT 
                    SUM(CASE WHEN flag_type = 'REVIEW REPORT' AND status != 'dismissed' THEN 1 ELSE 0 END) AS review_reports,
                    SUM(CASE WHEN flag_type = 'PROFILE FLAG' AND status != 'dismissed' THEN 1 ELSE 0 END) AS profile_flags,
                    SUM(CASE WHEN flag_type = 'FRAUD SIGNAL' AND status != 'dismissed' THEN 1 ELSE 0 END) AS fraud_signals,
                    COUNT(*) AS total_flags
                FROM {$this->table}";

        $stmt = $this->db->prepare($sql);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        return [
            'reviewReports' => intval($row['review_reports'] ?? 0),
            'profileFlags' => intval($row['profile_flags'] ?? 0),
            'fraudSignals' => intval($row['fraud_signals'] ?? 0),
            'totalFlags' => intval($row['total_flags'] ?? 0),
        ];
    }

    /**
     * Get filtered list of moderation flags
     */
    public function getAllFlags($status = null, $flagType = null) {
        $sql = "SELECT f.id, f.entity_type, f.entity_id, f.flag_type, f.severity, f.reported_by_user, f.shop_name, f.description, f.status, f.created_at,
                       s.isAvailable AS shop_is_available
                FROM {$this->table} f
                LEFT JOIN shop s ON (f.entity_type = 'shop' AND f.entity_id = s.id)
                WHERE 1=1";

        $params = [];

        if ($status && $status !== 'ALL') {
            $sql .= " AND f.status = :status";
            $params[':status'] = strtolower($status);
        }

        if ($flagType && $flagType !== 'ALL') {
            $sql .= " AND f.flag_type = :flag_type";
            $params[':flag_type'] = $flagType;
        }

        $sql .= " ORDER BY f.created_at DESC";

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Format relative time or ISO strings for frontend
        return array_map(function($row) {
            $created = strtotime($row['created_at']);
            $diffMins = round((time() - $created) / 60);

            if ($diffMins < 60) {
                $timeStr = max(1, $diffMins) . " mins ago";
            } elseif ($diffMins < 1440) {
                $timeStr = floor($diffMins / 60) . " hours ago";
            } else {
                $timeStr = floor($diffMins / 1440) . " days ago";
            }

            $isShopSuspended = isset($row['shop_is_available']) && (int)$row['shop_is_available'] === 0;

            $actions = [];
            if ($row['flag_type'] === 'REVIEW REPORT') {
                $actions = ['Dismiss Review', 'Hide Review', 'Ignore'];
            } elseif ($row['flag_type'] === 'PROFILE FLAG') {
                if ($isShopSuspended) {
                    $actions = ['Investigate', 'Reactivate Shop', 'Ignore'];
                } else {
                    $actions = ['Investigate', 'Suspend Shop', 'Ignore'];
                }
            } else {
                if ($isShopSuspended) {
                    $actions = ['Audit Logs', 'Reactivate Shop', 'Ignore'];
                } else {
                    $actions = ['Audit Logs', 'Freeze Ratings', 'Suspend Shop', 'Ignore'];
                }
            }

            return [
                'id' => intval($row['id']),
                'type' => $row['flag_type'],
                'severity' => $row['severity'],
                'time' => $timeStr,
                'desc' => $row['description'],
                'user' => $row['reported_by_user'],
                'shop' => $row['shop_name'],
                'status' => $row['status'],
                'isShopSuspended' => $isShopSuspended,
                'actions' => $actions,
                'createdAt' => $row['created_at']
            ];
        }, $rows);
    }

    /**
     * Resolve / Update status of a moderation flag and record audit log
     */
    public function resolveFlag($flagId, $actionTaken, $adminNotes = '', $adminId = null) {
        // Fetch flag details first
        $fetchStmt = $this->db->prepare("SELECT entity_type, entity_id, shop_name FROM {$this->table} WHERE id = ?");
        $fetchStmt->execute([$flagId]);
        $flag = $fetchStmt->fetch(PDO::FETCH_ASSOC);

        $responseMsg = "Moderation action '{$actionTaken}' executed successfully.";

        // Map UI action string to DB status
        $actionLower = strtolower($actionTaken);
        $newStatus = 'action_taken';
        if (in_array($actionLower, ['dismiss review', 'dismiss', 'ignore'])) {
            $newStatus = 'dismissed';
        } elseif (in_array($actionLower, ['investigate', 'audit logs'])) {
            $newStatus = 'under_review';
        }

        $sql = "UPDATE {$this->table} SET status = :status, updated_at = NOW() WHERE id = :id";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            ':status' => $newStatus,
            ':id' => $flagId
        ]);

        // Cascading Enforcement on underlying entities
        if ($flag) {
            $entityId = (int)($flag['entity_id'] ?? 0);
            $shopName = !empty($flag['shop_name']) ? $flag['shop_name'] : "Garage #{$entityId}";

            if ($actionLower === 'suspend shop' && $entityId > 0) {
                try {
                    $suspendStmt = $this->db->prepare("UPDATE shop SET isAvailable = 0 WHERE id = ?");
                    $suspendStmt->execute([$entityId]);
                    $responseMsg = "Garage '{$shopName}' has been successfully suspended and deactivated.";
                } catch (Throwable $e) {}
            }

            if (($actionLower === 'reactivate shop' || $actionLower === 'reactivate') && $entityId > 0) {
                try {
                    $reactivateStmt = $this->db->prepare("UPDATE shop SET isAvailable = 1 WHERE id = ?");
                    $reactivateStmt->execute([$entityId]);
                    $responseMsg = "Garage '{$shopName}' has been successfully reactivated.";
                } catch (Throwable $e) {}
            }

            if ($actionLower === 'hide review' && $entityId > 0) {
                try {
                    $hideStmt = $this->db->prepare("UPDATE review SET status = 'hidden' WHERE id = ?");
                    $hideStmt->execute([$entityId]);
                    $responseMsg = "Review #{$entityId} has been hidden from public view.";
                } catch (Throwable $e) {}
            }
        }

        // Insert audit log entry
        $logSql = "INSERT INTO {$this->logsTable} (flag_id, admin_id, action_taken, notes) VALUES (:flag_id, :admin_id, :action, :notes)";
        $logStmt = $this->db->prepare($logSql);
        $logStmt->execute([
            ':flag_id' => $flagId,
            ':admin_id' => $adminId,
            ':action' => $actionTaken,
            ':notes' => $adminNotes
        ]);

        return $responseMsg;
    }

    /**
     * Submit a new moderation flag report
     */
    public function submitReport($shopId, $flagType, $reporterName, $shopName, $description) {
        $insertSql = "INSERT INTO {$this->table} 
                      (entity_type, entity_id, flag_type, severity, reported_by_user, shop_name, description, status, created_at)
                      VALUES ('shop', :entity_id, :flag_type, 'medium', :reported_by, :shop_name, :description, 'pending', NOW())";
        
        $stmt = $this->db->prepare($insertSql);
        return $stmt->execute([
            ':entity_id' => $shopId,
            ':flag_type' => $flagType,
            ':reported_by' => $reporterName,
            ':shop_name' => $shopName,
            ':description' => $description
        ]);
    }
}
