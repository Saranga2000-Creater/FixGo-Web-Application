<?php

class BillingConfiguration {
    private $conn;
    private $table_name = 'billingConfiguration';

    public function __construct($db) {
        $this->conn = $db;
    }

    // ============================================================
    // Retrieve the single configuration row
    // ============================================================

    public function get(): ?array {
        $stmt = $this->conn->query("SELECT * FROM {$this->table_name} LIMIT 1");
        $row  = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row ?: null;
    }

    // ============================================================
    // Update one or more rate/grace-period constants
    // Caller is responsible for whitelisting field names.
    // $fields = ['fieldName' => value, ...]
    // ============================================================

    public function update(array $fields, int $adminId): bool {
        $sets   = [];
        $params = [':adminId' => $adminId];

        foreach ($fields as $col => $val) {
            $sets[]         = "`{$col}` = :{$col}";
            $params[":{$col}"] = $val;
        }

        $sql  = "UPDATE {$this->table_name} SET " . implode(', ', $sets) . ", `updatedByAdminId` = :adminId WHERE id = 1";
        $stmt = $this->conn->prepare($sql);
        return $stmt->execute($params);
    }
}
