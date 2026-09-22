<?php

require_once __DIR__ . '/BaseModel.php';

class BillingConfiguration extends BaseModel {
    protected $table_name = 'billingConfiguration';

    protected ?int $id = null;
    protected ?float $basePlatformFee = null;
    protected ?float $perRequestFee = null;
    protected ?int $gracePeriodDays = null;
    protected ?int $updatedByAdminId = null;
    protected ?string $updatedAt = null;

    
    // Retrieve the single configuration row
    

    public function get(): ?array {
        $row = $this->qb->table($this->table_name)->first();
        return $row ?: null;
    }

    
    // Update one or more rate/grace-period constants
    // Caller is responsible for whitelisting field names.
    // $fields = ['fieldName' => value, ...]
    

    public function update(array $fields, int $adminId): bool {
        $updateData = $fields;
        $updateData['updatedByAdminId'] = $adminId;
        
        $this->qb->table($this->table_name)->where('id', 1)->update($updateData);
        return true;
    }
}
