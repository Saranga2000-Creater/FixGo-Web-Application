<?php

class Customer {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function getById($customerId) {
        $stmt = $this->conn->prepare("
            SELECT 
                c.id,
                c.name,
                c.contactNumber,
                c.address,
                c.profilePhoto,
                c.createdAt,
                u.email
            FROM customer c
            JOIN users u ON c.id = u.id
            WHERE c.id = :id
            LIMIT 1
        ");
        
        $stmt->bindParam(':id', $customerId, PDO::PARAM_INT);
        $stmt->execute();
        
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Adds a penalty strike if a customer cancels a Confirmed handshake
    public function incrementCancellationStrikes($customer_id) {
        $query = "UPDATE customer SET cancellation_strikes = cancellation_strikes + 1 WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $customer_id, PDO::PARAM_INT);
        return $stmt->execute();
    }
}