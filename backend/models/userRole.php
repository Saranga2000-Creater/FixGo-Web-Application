<?php

require_once __DIR__ . '/BaseModel.php';

class User extends BaseModel {
    protected $table_name = "users";

    protected ?int $id = null;
    protected ?string $email = null;
    protected ?string $userRole = null;
    protected ?string $password = null;
    protected ?int $isActive = null;
    protected ?int $is_email_verified = null;
    protected ?string $verification_token = null;
    protected ?string $token_expiry = null;
    protected ?string $reset_token = null;
    protected ?string $reset_token_expiry = null;

    // jsonSerialize and constructor are inherited from BaseModel

    public function getId() { return $this->id; }
    public function getEmail() { return $this->email; }
    public function getUserRole() { return $this->userRole; }
    public function getPassword() { return $this->password; }
    public function getIsActive() { return $this->isActive; }
    public function getIsEmailVerified() { return $this->is_email_verified; }
    public function getTokenExpiry() { return $this->token_expiry; }
    public function getResetTokenExpiry() { return $this->reset_token_expiry; }

    public function findByEmail($email){
        return $this->qb->table($this->table_name)->where('email', $email)->firstAsObject(self::class);
    }

    public function findByVerificationToken($token) {
        return $this->qb->table($this->table_name)->where('verification_token', $token)->firstAsObject(self::class);
    }

    public function verifyEmail($userId, ?string $role = null) {
        try {
            $this->qb->beginTransaction();
            
            $userRole = $role ?? $this->userRole;
            if ($userRole === null) {
                $user = $this->qb->table($this->table_name)->where('id', $userId)->select(['userRole'])->first();
                $userRole = $user['userRole'] ?? null;
            }

            if ($userRole === 'shop_owner') {
                $this->qb->table($this->table_name)
                    ->where('id', $userId)
                    ->update([
                        'is_email_verified' => 1,
                        'verification_token' => null
                    ]);
            } else {
                $this->qb->table($this->table_name)
                    ->where('id', $userId)
                    ->update([
                        'is_email_verified' => 1,
                        'isActive' => 1,
                        'verification_token' => null
                    ]);
            }
            
            $this->qb->commit();
            return true;
        } catch (Exception $e) {
            if ($this->qb->inTransaction()) {
                $this->qb->rollBack();
            }
            throw $e;
        }
    }

    public function setResetOtp($email, $otp, $expiryMinutes = 15) {
        $expiry = date('Y-m-d H:i:s', time() + ($expiryMinutes * 60));
        $this->qb->table($this->table_name)
            ->where('email', $email)
            ->update([
                'reset_token' => $otp,
                'reset_token_expiry' => $expiry
            ]);
        return true;
    }

    public function findByResetOtp($otp) {
        return $this->qb->table($this->table_name)->where('reset_token', $otp)->firstAsObject(self::class);
    }

    public function updatePassword($userId, $newPasswordHash) {
        $this->qb->table($this->table_name)
            ->where('id', $userId)
            ->update([
                'password' => $newPasswordHash,
                'reset_token' => null,
                'reset_token_expiry' => null
            ]);
        return true;
    }

    public function getActiveCustomerCount() {
        return $this->qb->table($this->table_name)
            ->where('isActive', 1)
            ->where('userRole', 'customer')
            ->count();
    }

    public function getUserRoleDistribution() {
        $results = $this->qb->table($this->table_name)
            ->select('userRole', 'COUNT(id) as count')
            ->where('isActive', 1)
            ->whereIn('userRole', ['customer', 'shop_owner'])
            ->groupBy('userRole')
            ->get();
            
        $formatted = [];
        foreach ($results as $row) {
            $formatted[] = [
                'name' => ucfirst(str_replace('_', ' ', $row['userRole'])),
                'value' => (int)$row['count']
            ];
        }
        return $formatted;
    }

    public function getPendingShopOwnerCount() {
        return $this->qb->table($this->table_name)
            ->where('userRole', 'shop_owner')
            ->where('is_email_verified', 1)
            ->where('isActive', 0)
            ->count();
    }

    public function verifyPassword($userId, $currentPassword) {
        $user = $this->qb->table($this->table_name)->select('password')->where('id', $userId)->first();
        if (!$user) {
            return false;
        }
        return password_verify($currentPassword, $user['password']);
    }

    public function isEmailTaken($email, $excludeUserId) {
        $row = $this->qb->table($this->table_name)
            ->select('id')
            ->where('email', $email)
            ->where('id', '!=', $excludeUserId)
            ->first();
        return (bool)$row;
    }

    /**
     * Refreshes the verification token and expiry for an unverified user.
     * Used by the Resend OTP feature.
     *
     * @param string $email The user's email
     * @param string $otp   New 6-digit OTP
     * @return bool
     */
    public function refreshVerificationToken($email, $otp) {
        $expiry = date('Y-m-d H:i:s', time() + (5 * 60)); // 5 minutes from now
        $this->qb->table($this->table_name)
            ->where('email', $email)
            ->update([
                'verification_token' => $otp,
                'token_expiry'       => $expiry
            ]);
        return true;
    }

    public function activateUser($userId) {
        $this->qb->table($this->table_name)
            ->where('id', $userId)
            ->update(['isActive' => 1]);
        return true;
    }

    /**
     * Soft deletes a user account by setting isActive = 0 and anonymizing their email
     * to free it up for future registrations.
     */
    public function deleteAccount($userId, $currentEmail) {
        $timestamp = time();
        $anonymizedEmail = 'deleted_' . $timestamp . '_' . $currentEmail;
        
        $this->qb->table($this->table_name)
            ->where('id', $userId)
            ->update([
                'isActive' => 0,
                'email' => $anonymizedEmail,
                'password' => '',
                'verification_token' => null,
                'reset_token' => null,
                'token_expiry' => null,
                'reset_token_expiry' => null
            ]);
            
        return true;
    }
}
?>