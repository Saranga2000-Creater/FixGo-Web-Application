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

            return true;
        }

        return false;
    }

}