<?php

class User {
    private $conn;
    private $table_name = "users";

    public $id;
    public $email;
    public $userRole;
    public $password;
    public $isActive;
    public $is_email_verified;
    public $verification_token;
    public $token_expiry;
    public $reset_token;
    public $reset_token_expiry;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function findByEmail($email){
        $query = "SELECT *
                  FROM " . $this->table_name . " 
                  WHERE email = :email LIMIT 1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':email', $email);
        $stmt->execute();

        if($stmt->rowCount()>0){
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            $this->id = $row['id'];
            $this->email = $row['email'];
            $this->userRole = $row['userRole'];
            $this->password = $row['password'];
            $this->isActive = $row['isActive'];
            $this->is_email_verified = $row['is_email_verified'] ?? 0;
            $this->verification_token = $row['verification_token'] ?? null;
            $this->token_expiry = $row['token_expiry'] ?? null;
            $this->reset_token = $row['reset_token'] ?? null;
            $this->reset_token_expiry = $row['reset_token_expiry'] ?? null;

            return true;
        }

        return false;
    }

    public function findByVerificationToken($token) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE verification_token = :token LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':token', $token);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            $this->id = $row['id'];
            $this->email = $row['email'];
            $this->userRole = $row['userRole'];
            $this->password = $row['password'];
            $this->isActive = $row['isActive'];
            $this->is_email_verified = $row['is_email_verified'] ?? 0;
            $this->verification_token = $row['verification_token'] ?? null;
            $this->token_expiry = $row['token_expiry'] ?? null;
            $this->reset_token = $row['reset_token'] ?? null;
            $this->reset_token_expiry = $row['reset_token_expiry'] ?? null;

            return true;
        }

        return false;
    }

    public function verifyEmail($userId) {
        try {
            $this->conn->beginTransaction();
            $query = "UPDATE " . $this->table_name . " 
                      SET is_email_verified = 1, isActive = 1, verification_token = NULL 
                      WHERE id = :id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':id', $userId, PDO::PARAM_INT);
            $result = $stmt->execute();
            $this->conn->commit();
            return $result;
        } catch (Exception $e) {
            if ($this->conn->inTransaction()) {
                $this->conn->rollBack();
            }
            throw $e;
        }
    }

    public function setResetOtp($email, $otp, $expiryMinutes = 15) {
        $expiry = date('Y-m-d H:i:s', time() + ($expiryMinutes * 60));
        $query = "UPDATE " . $this->table_name . " 
                  SET reset_token = :otp, reset_token_expiry = :expiry 
                  WHERE email = :email";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':otp', $otp);
        $stmt->bindParam(':expiry', $expiry);
        $stmt->bindParam(':email', $email);
        return $stmt->execute();
    }

    public function findByResetOtp($otp) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE reset_token = :otp LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':otp', $otp);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            $this->id = $row['id'];
            $this->email = $row['email'];
            $this->userRole = $row['userRole'];
            $this->password = $row['password'];
            $this->isActive = $row['isActive'];
            $this->is_email_verified = $row['is_email_verified'] ?? 0;
            $this->verification_token = $row['verification_token'] ?? null;
            $this->token_expiry = $row['token_expiry'] ?? null;
            $this->reset_token = $row['reset_token'] ?? null;
            $this->reset_token_expiry = $row['reset_token_expiry'] ?? null;

            return true;
        }

        return false;
    }

    public function updatePassword($userId, $newPasswordHash) {
        $query = "UPDATE " . $this->table_name . " 
                  SET password = :password, reset_token = NULL, reset_token_expiry = NULL 
                  WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':password', $newPasswordHash);
        $stmt->bindParam(':id', $userId, PDO::PARAM_INT);
        return $stmt->execute();
    }

}