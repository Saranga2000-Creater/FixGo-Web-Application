<?php

class ModerationFlag {
    private $qb;
    private $table = 'moderation_flags';
    private $logsTable = 'moderation_logs';

    public function __construct($db, $queryBuilder = null) {
        $this->qb = $queryBuilder ?: new QueryBuilder($db);
    }

    public function getSummaryCounts() {
        $row = $this->qb->table($this->table)
            ->select(
                "SUM(CASE WHEN flag_type = 'REVIEW REPORT' AND status != 'dismissed' THEN 1 ELSE 0 END) AS review_reports",
                "SUM(CASE WHEN flag_type = 'PROFILE FLAG' AND status != 'dismissed' THEN 1 ELSE 0 END) AS profile_flags",
                "SUM(CASE WHEN flag_type = 'FRAUD SIGNAL' AND status != 'dismissed' THEN 1 ELSE 0 END) AS fraud_signals",
                "COUNT(*) AS total_flags"
            )->first();

        return [
            'reviewReports' => intval($row['review_reports'] ?? 0),
            'profileFlags' => intval($row['profile_flags'] ?? 0),
            'fraudSignals' => intval($row['fraud_signals'] ?? 0),
            'totalFlags' => intval($row['total_flags'] ?? 0),
        ];
    }

    public function getAllFlags($status = null, $flagType = null) {
        $query = $this->qb->table($this->table, 'f')
            ->select('f.id', 'f.entity_type', 'f.entity_id', 'f.flag_type', 'f.severity', 'f.reported_by_user', 'f.shop_name', 'f.description', 'f.status', 'f.created_at', 's.isAvailable AS shop_is_available')
            ->leftJoin('shop s', 'f.entity_id', '=', 's.id AND f.entity_type = \'shop\'');

        if ($status && $status !== 'ALL') {
            $query->where('f.status', strtolower($status));
        }

        if ($flagType && $flagType !== 'ALL') {
            $query->where('f.flag_type', $flagType);
        }

        $rows = $query->orderBy('f.created_at', 'DESC')->get();

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

    public function resolveFlag($flagId, $actionTaken, $adminNotes = '', $adminId = null) {
        $flag = $this->qb->table($this->table)
            ->select('entity_type', 'entity_id', 'shop_name')
            ->where('id', $flagId)
            ->first();

        $responseMsg = "Moderation action '{$actionTaken}' executed successfully.";

        $actionLower = strtolower($actionTaken);
        $newStatus = 'action_taken';
        if (in_array($actionLower, ['dismiss review', 'dismiss', 'ignore'])) {
            $newStatus = 'dismissed';
        } elseif (in_array($actionLower, ['investigate', 'audit logs'])) {
            $newStatus = 'under_review';
        }

        $this->qb->table($this->table)
            ->where('id', $flagId)
            ->update([
                'status' => $newStatus,
                'updated_at' => QueryBuilder::raw('NOW()')
            ]);

        if ($flag) {
            $entityId = (int)($flag['entity_id'] ?? 0);
            $shopName = !empty($flag['shop_name']) ? $flag['shop_name'] : "Garage #{$entityId}";

            if ($actionLower === 'suspend shop' && $entityId > 0) {
                try {
                    $this->qb->table('shop')->where('id', $entityId)->update(['isAvailable' => 0]);
                    $responseMsg = "Garage '{$shopName}' has been successfully suspended and deactivated.";
                } catch (Throwable $e) {}
            }

            if (($actionLower === 'reactivate shop' || $actionLower === 'reactivate') && $entityId > 0) {
                try {
                    $this->qb->table('shop')->where('id', $entityId)->update(['isAvailable' => 1]);
                    $responseMsg = "Garage '{$shopName}' has been successfully reactivated.";
                } catch (Throwable $e) {}
            }

            if ($actionLower === 'hide review' && $entityId > 0) {
                try {
                    $this->qb->table('review')->where('id', $entityId)->update(['status' => 'hidden']);
                    $responseMsg = "Review #{$entityId} has been hidden from public view.";
                } catch (Throwable $e) {}
            }
        }

        $this->qb->table($this->logsTable)->insert([
            'flag_id' => $flagId,
            'admin_id' => $adminId,
            'action_taken' => $actionTaken,
            'notes' => $adminNotes
        ]);

        return $responseMsg;
    }

    public function submitReport($shopId, $flagType, $reporterName, $shopName, $description) {
        $this->qb->table($this->table)->insert([
            'entity_type' => 'shop',
            'entity_id' => $shopId,
            'flag_type' => $flagType,
            'severity' => 'medium',
            'reported_by_user' => $reporterName,
            'shop_name' => $shopName,
            'description' => $description,
            'status' => 'pending',
            'created_at' => QueryBuilder::raw('NOW()')
        ]);
        return true;
    }
}
?>
