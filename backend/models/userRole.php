<?php

class User {
    private $conn;
    private $table_name = "users";

    public $id;
    public $email;
    public $userRole;
    public $password;
    public $isActive;

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

            return true;
        }

        return false;
    }

}