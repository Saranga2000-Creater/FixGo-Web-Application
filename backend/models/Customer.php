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

    /**
     * Registers a new customer by inserting into both 'users' and 'customer' tables.
     * Starts a database transaction.
     * 
     * @param array $userData Contains email, password, verification_token
     * @param array $customerData Contains name, contactNumber, address, profilePhoto
     * @return int The newly created user/customer ID
     * @throws Exception if registration fails
     */
    public function register($userData, $customerData) {
        try {
            $this->conn->beginTransaction();

            // 1. Insert into users
            $userQuery = "INSERT INTO users (email, userRole, password, isActive, verification_token, is_email_verified, token_expiry) 
                          VALUES (:email, 'customer', :password, 0, :token, 0, DATE_ADD(NOW(), INTERVAL 1 HOUR))";
            $userStmt = $this->conn->prepare($userQuery);
            $userStmt->execute([
                ':email' => $userData['email'],
                ':password' => $userData['password'],
                ':token' => $userData['verification_token']
            ]);
            
            $userId = $this->conn->lastInsertId();

            // 2. Insert into customer
            $customerQuery = "INSERT INTO customer (id, name, contactNumber, address, profilePhoto) 
                              VALUES (:id, :name, :contactNumber, :address, :profilePhoto)";
            
            $customerStmt = $this->conn->prepare($customerQuery);
            $customerStmt->execute([
                ':id' => $userId,
                ':name' => $customerData['name'],
                ':contactNumber' => $customerData['contactNumber'],
                ':address' => $customerData['address'],
                ':profilePhoto' => $customerData['profilePhoto']
            ]);

            $this->conn->commit();
            return $userId;
        } catch (Exception $e) {
            if ($this->conn->inTransaction()) {
                $this->conn->rollBack();
            }
            throw $e;
        }
    }

    /**
     * Updates customer profile details and optionally user password.
     */
    public function updateProfile($customerId, $data, $newPassword = null) {
        try {
            $this->conn->beginTransaction();

            $fields = [];
            $params = [':id' => $customerId];

            if (array_key_exists('name', $data)) {
                $fields[] = "name = :name";
                $params[':name'] = $data['name'];
            }
            if (array_key_exists('contactNumber', $data)) {
                $fields[] = "contactNumber = :contactNumber";
                $params[':contactNumber'] = $data['contactNumber'];
            }
            if (array_key_exists('address', $data)) {
                $fields[] = "address = :address";
                $params[':address'] = $data['address'];
            }
            if (array_key_exists('profilePhoto', $data)) {
                $fields[] = "profilePhoto = :profilePhoto";
                $params[':profilePhoto'] = $data['profilePhoto'];
            }

            if (!empty($fields)) {
                $sql = "UPDATE customer SET " . implode(', ', $fields) . " WHERE id = :id";
                $stmt = $this->conn->prepare($sql);
                $stmt->execute($params);
            }

            if (!empty($newPassword)) {
                $passwordHash = password_hash($newPassword, PASSWORD_DEFAULT);
                $userSql = "UPDATE users SET password = :password WHERE id = :id";
                $userStmt = $this->conn->prepare($userSql);
                $userStmt->execute([
                    ':password' => $passwordHash,
                    ':id' => $customerId
                ]);
            }

            $this->conn->commit();
            return true;
        } catch (Exception $e) {
            if ($this->conn->inTransaction()) {
                $this->conn->rollBack();
            }
            throw $e;
        }
    }
}