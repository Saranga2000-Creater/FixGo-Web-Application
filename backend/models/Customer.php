<?php

class Customer {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function getById($customerId) {
        $stmt = $this->conn->prepare("
            SELECT 
                id,
                name,
                email,
                contactNumber,
                address,
                profilePhoto,
                createdAt
            FROM customer
            WHERE id = :id
            LIMIT 1
        ");
        $stmt->bindParam(':id', $customerId, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}