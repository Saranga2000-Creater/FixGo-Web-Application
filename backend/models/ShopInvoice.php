<?php

class ShopInvoice {
    private $conn;
    private $table_name = 'shopInvoice';

    public function __construct($db) {
        $this->conn = $db;
    }

    // ============================================================
    // Check if any invoices exist for a given billing period
    // ============================================================

    public function existsForPeriod(int $year, int $month): bool {
        $stmt = $this->conn->prepare(
            "SELECT COUNT(*) FROM {$this->table_name}
             WHERE billingPeriodYear = :y AND billingPeriodMonth = :m"
        );
        $stmt->execute([':y' => $year, ':m' => $month]);
        return (int)$stmt->fetchColumn() > 0;
    }

    // ============================================================
    // Fetch all shops with their category for billing generation.
    // Returns: [ ['shopId' => X, 'shopCategoryId' => Y], ... ]
    // ============================================================

    public function getShopsForBilling(): array {
        $stmt = $this->conn->query(
            "SELECT s.id AS shopId, scm.shop_category_id AS shopCategoryId
             FROM shop s
             JOIN users u              ON s.id = u.id
             JOIN shopCategoryMapping scm ON s.id = scm.shop_id
             WHERE u.userRole = 'shop_owner'
             GROUP BY s.id"
        );
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // ============================================================
    // Count completed service requests for a shop in a given month
    // ============================================================

    public function countCompletedRequests(int $shopId, int $year, int $month): int {
        $stmt = $this->conn->prepare(
            "SELECT COUNT(*) FROM serviceRequest
             WHERE shop_id = :shopId
               AND status = 'Completed'
               AND YEAR(completed_at)  = :y
               AND MONTH(completed_at) = :m"
        );
        $stmt->execute([':shopId' => $shopId, ':y' => $year, ':m' => $month]);
        return (int)$stmt->fetchColumn();
    }

    // ============================================================
    // Insert a single draft invoice row
    // ============================================================

    public function insertDraft(array $data): bool {
        $stmt = $this->conn->prepare(
            "INSERT INTO {$this->table_name}
             (shopId, billingPeriodYear, billingPeriodMonth, shopCategoryId,
              rateSnapshot, completedRequests, totalAmount, invoiceReference, invoiceStatus)
             VALUES
             (:shopId, :year, :month, :catId,
              :rate, :requests, :amount, :ref, 'Draft')"
        );
        return $stmt->execute([
            ':shopId'   => $data['shopId'],
            ':year'     => $data['billingPeriodYear'],
            ':month'    => $data['billingPeriodMonth'],
            ':catId'    => $data['shopCategoryId'],
            ':rate'     => $data['rateSnapshot'],
            ':requests' => $data['completedRequests'],
            ':amount'   => $data['totalAmount'],
            ':ref'      => $data['invoiceReference'],
        ]);
    }

    // ============================================================
    // Get draft invoices for admin review (with shop & category name)
    // ============================================================

    public function getDrafts(?int $year, ?int $month): array {
        $where  = ["si.invoiceStatus = 'Draft'"];
        $params = [];

        if ($year)  { $where[] = 'si.billingPeriodYear = :y';  $params[':y'] = $year;  }
        if ($month) { $where[] = 'si.billingPeriodMonth = :m'; $params[':m'] = $month; }

        $sql = "SELECT si.*, s.name AS shopName, sc.name AS categoryName
                FROM {$this->table_name} si
                JOIN shop s          ON si.shopId         = s.id
                JOIN shopCategory sc ON si.shopCategoryId = sc.id
                WHERE " . implode(' AND ', $where) . "
                ORDER BY si.billingPeriodYear DESC, si.billingPeriodMonth DESC, s.name ASC";

        $stmt = $this->conn->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // ============================================================
    // Get all Draft invoices for a period (with email & shop name for dispatch)
    // ============================================================

    public function getDraftsForDispatch(int $year, int $month): array {
        $stmt = $this->conn->prepare(
            "SELECT si.*, u.email AS shopEmail, s.name AS shopName
             FROM {$this->table_name} si
             JOIN shop s  ON si.shopId = s.id
             JOIN users u ON si.shopId = u.id
             WHERE si.billingPeriodYear = :y AND si.billingPeriodMonth = :m
               AND si.invoiceStatus = 'Draft'"
        );
        $stmt->execute([':y' => $year, ':m' => $month]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // ============================================================
    // Dispatch a single invoice (set status, dispatchedAt, dueDate)
    // ============================================================

    public function dispatch(int $id, int $graceDays): bool {
        $stmt = $this->conn->prepare(
            "UPDATE {$this->table_name}
             SET invoiceStatus = 'Dispatched',
                 dispatchedAt  = NOW(),
                 dueDate       = DATE_ADD(CURDATE(), INTERVAL :days DAY)
             WHERE id = :id"
        );
        return $stmt->execute([':days' => $graceDays, ':id' => $id]);
    }

    // ============================================================
    // Ignore a single 0 LKR invoice (set status to Ignored)
    // ============================================================

    public function ignore(int $id): bool {
        $stmt = $this->conn->prepare(
            "UPDATE {$this->table_name}
             SET invoiceStatus = 'Ignored',
                 dispatchedAt  = NOW()
             WHERE id = :id"
        );
        return $stmt->execute([':id' => $id]);
    }

    // ============================================================
    // Get all invoices for a shop (full ledger — admin view)
    // ============================================================

    public function getLedgerByShop(int $shopId): array {
        $stmt = $this->conn->prepare(
            "SELECT si.*, sc.name AS categoryName
             FROM {$this->table_name} si
             JOIN shopCategory sc ON si.shopCategoryId = sc.id
             WHERE si.shopId = :shopId
             ORDER BY si.billingPeriodYear DESC, si.billingPeriodMonth DESC"
        );
        $stmt->execute([':shopId' => $shopId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // ============================================================
    // Get ALL invoices across all shops (admin global ledger)
    // Optional filters: shopId, status, year, month
    // ============================================================

    public function getAllInvoices(array $filters = []): array {
        $where  = ['1=1'];
        $params = [];

        if (!empty($filters['shopId'])) {
            $where[] = 'si.shopId = :shopId';
            $params[':shopId'] = (int)$filters['shopId'];
        }
        if (!empty($filters['status'])) {
            $where[] = 'si.invoiceStatus = :status';
            $params[':status'] = $filters['status'];
        }
        if (!empty($filters['year'])) {
            $where[] = 'si.billingPeriodYear = :y';
            $params[':y'] = (int)$filters['year'];
        }
        if (!empty($filters['month'])) {
            $where[] = 'si.billingPeriodMonth = :m';
            $params[':m'] = (int)$filters['month'];
        }

        $sql = "SELECT si.*,
                       s.name       AS shopName,
                       u.email      AS shopEmail,
                       sc.name      AS shopCategory
                FROM {$this->table_name} si
                JOIN shop s          ON si.shopId         = s.id
                JOIN users u         ON si.shopId         = u.id
                JOIN shopCategory sc ON si.shopCategoryId = sc.id
                WHERE " . implode(' AND ', $where) . "
                ORDER BY si.billingPeriodYear DESC, si.billingPeriodMonth DESC, s.name ASC
                LIMIT 200";

        $stmt = $this->conn->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }


    // ============================================================
    // Get all invoices in Verification Pending state (admin queue)
    // ============================================================

    public function getPendingVerifications(): array {
        $stmt = $this->conn->query(
            "SELECT si.*, s.name AS shopName, s.contactNumber, u.email AS shopEmail,
                    sc.name AS categoryName
             FROM {$this->table_name} si
             JOIN shop s          ON si.shopId         = s.id
             JOIN users u         ON si.shopId         = u.id
             JOIN shopCategory sc ON si.shopCategoryId = sc.id
             WHERE si.invoiceStatus = 'Verification Pending'
             ORDER BY si.slipSubmittedAt ASC"
        );
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // ============================================================
    // Find a single Verification Pending invoice (with shop email & name)
    // ============================================================

    public function findPendingVerification(int $invoiceId): ?array {
        $stmt = $this->conn->prepare(
            "SELECT si.*, u.email AS shopEmail, s.name AS shopName
             FROM {$this->table_name} si
             JOIN shop s  ON si.shopId = s.id
             JOIN users u ON si.shopId = u.id
             WHERE si.id = :id AND si.invoiceStatus = 'Verification Pending'
             LIMIT 1"
        );
        $stmt->execute([':id' => $invoiceId]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row ?: null;
    }

    // ============================================================
    // Approve: set status to Paid
    // ============================================================

    public function markPaid(int $invoiceId, int $adminId): bool {
        $stmt = $this->conn->prepare(
            "UPDATE {$this->table_name}
             SET invoiceStatus = 'Paid', verifiedAt = NOW(), verifiedByAdminId = :adminId
             WHERE id = :id"
        );
        return $stmt->execute([':adminId' => $adminId, ':id' => $invoiceId]);
    }

    // ============================================================
    // Reject: set status to Dispatched, store reason
    // ============================================================

    public function rejectVerification(int $invoiceId, string $reason): bool {
        $stmt = $this->conn->prepare(
            "UPDATE {$this->table_name}
             SET invoiceStatus = 'Dispatched', rejectionReason = :reason
             WHERE id = :id"
        );
        return $stmt->execute([':reason' => $reason, ':id' => $invoiceId]);
    }

    // ============================================================
    // Get shop owner's own invoices (Draft excluded)
    // ============================================================

    public function getOwnerInvoices(int $shopId): array {
        $stmt = $this->conn->prepare(
            "SELECT si.*, sc.name AS categoryName
             FROM {$this->table_name} si
             JOIN shopCategory sc ON si.shopCategoryId = sc.id
             WHERE si.shopId = :shopId AND si.invoiceStatus != 'Draft'
             ORDER BY si.billingPeriodYear DESC, si.billingPeriodMonth DESC"
        );
        $stmt->execute([':shopId' => $shopId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // ============================================================
    // Find a payable invoice for payment slip submission
    // (must belong to shop and be in Dispatched or Overdue state)
    // ============================================================

    public function findPayable(int $invoiceId, int $shopId): ?array {
        $stmt = $this->conn->prepare(
            "SELECT * FROM {$this->table_name}
             WHERE id = :id AND shopId = :shopId
               AND invoiceStatus IN ('Dispatched', 'Overdue')
             LIMIT 1"
        );
        $stmt->execute([':id' => $invoiceId, ':shopId' => $shopId]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row ?: null;
    }

    // ============================================================
    // Submit payment slip — move to Verification Pending
    // ============================================================

    public function submitPaymentSlip(int $invoiceId, string $slipUrl, string $paymentReference): bool {
        $stmt = $this->conn->prepare(
            "UPDATE {$this->table_name}
             SET invoiceStatus    = 'Verification Pending',
                 paymentSlipUrl   = :slipUrl,
                 paymentReference = :ref,
                 slipSubmittedAt  = NOW()
             WHERE id = :id"
        );
        return $stmt->execute([':slipUrl' => $slipUrl, ':ref' => $paymentReference, ':id' => $invoiceId]);
    }

    // ============================================================
    // Cron: find all Dispatched invoices past their due date
    // ============================================================

    public function findOverdueForSweep(): array {
        $stmt = $this->conn->query(
            "SELECT si.*, s.name AS shopName, u.email AS shopEmail 
             FROM {$this->table_name} si
             JOIN shop s ON si.shopId = s.id
             JOIN users u ON si.shopId = u.id
             WHERE si.invoiceStatus = 'Dispatched' AND si.dueDate < CURDATE()"
        );
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // ============================================================
    // Cron: mark a single invoice as Overdue
    // ============================================================

    public function markOverdue(int $invoiceId): bool {
        $stmt = $this->conn->prepare(
            "UPDATE {$this->table_name} SET invoiceStatus = 'Overdue' WHERE id = :id"
        );
        return $stmt->execute([':id' => $invoiceId]);
    }

    // ============================================================
    // Analytics: revenue grouped by period & category (Paid only)
    // ============================================================

    public function getRevenueChartData(): array {
        $stmt = $this->conn->query(
            "SELECT billingPeriodYear, billingPeriodMonth, shopCategoryId, SUM(totalAmount) AS revenue
             FROM {$this->table_name}
             WHERE invoiceStatus = 'Paid'
             GROUP BY billingPeriodYear, billingPeriodMonth, shopCategoryId
             ORDER BY billingPeriodYear DESC, billingPeriodMonth DESC
             LIMIT 36"
        );
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // ============================================================
    // Analytics: invoice status distribution (for pie chart)
    // ============================================================

    public function getCollectionHealth(): array {
        $stmt = $this->conn->query(
            "SELECT billingPeriodYear, billingPeriodMonth, invoiceStatus, COUNT(*) AS cnt, COALESCE(SUM(totalAmount), 0) AS amount
             FROM {$this->table_name}
             WHERE invoiceStatus IN ('Paid','Verification Pending','Overdue','Dispatched')
             GROUP BY billingPeriodYear, billingPeriodMonth, invoiceStatus
             ORDER BY billingPeriodYear DESC, billingPeriodMonth DESC"
        );
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // ============================================================
    // Analytics: completed requests this month per shop/category
    // (for projected revenue KPI)
    // ============================================================

    public function getCurrentMonthVolumeByCategory(int $year, int $month, array $categoryIds): array {
        $placeholders = implode(',', array_fill(0, count($categoryIds), '?'));
        $stmt = $this->conn->prepare(
            "SELECT sr.shop_id, scm.shop_category_id, COUNT(*) AS cnt
             FROM serviceRequest sr
             JOIN shopCategoryMapping scm ON sr.shop_id = scm.shop_id
             WHERE sr.status = 'Completed'
               AND YEAR(sr.completed_at)  = ?
               AND MONTH(sr.completed_at) = ?
               AND scm.shop_category_id IN ({$placeholders})
             GROUP BY sr.shop_id, scm.shop_category_id"
        );
        $stmt->execute(array_merge([$year, $month], $categoryIds));
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
