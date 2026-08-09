<?php
class CustomerVehicle {
    private $conn;
    private $table_name = 'customerVehicle';

    public function __construct($db) {
        $this->conn = $db;
    }

    public function getByCustomer($customer_id) {
        $query = "SELECT id, vehicle_category_id, brand, color FROM " . $this->table_name . " WHERE customer_id = :customer_id ORDER BY id DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':customer_id', $customer_id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function add($data) {
        $query = "INSERT INTO " . $this->table_name . " (customer_id, vehicle_category_id, brand, color) VALUES (:customer_id, :vehicle_category_id, :brand, :color)";
        $stmt = $this->conn->prepare($query);

        $customer_id = htmlspecialchars(strip_tags($data['customer_id']));
        $vehicle_category_id = htmlspecialchars(strip_tags($data['vehicle_category_id']));
        $brand = htmlspecialchars(strip_tags($data['brand']));
        $color = htmlspecialchars(strip_tags($data['color']));

        $stmt->bindParam(':customer_id', $customer_id, PDO::PARAM_INT);
        $stmt->bindParam(':vehicle_category_id', $vehicle_category_id, PDO::PARAM_INT);
        $stmt->bindParam(':brand', $brand);
        $stmt->bindParam(':color', $color);

        if ($stmt->execute()) {
            return $this->conn->lastInsertId();
        }
        return false;
    }

    public function update($id, $customer_id, $data) {
        $query = "UPDATE " . $this->table_name . " SET vehicle_category_id = :vehicle_category_id, brand = :brand, color = :color WHERE id = :id AND customer_id = :customer_id";
        $stmt = $this->conn->prepare($query);

        $vehicle_category_id = htmlspecialchars(strip_tags($data['vehicle_category_id']));
        $brand = htmlspecialchars(strip_tags($data['brand']));
        $color = htmlspecialchars(strip_tags($data['color']));

        $stmt->bindParam(':vehicle_category_id', $vehicle_category_id, PDO::PARAM_INT);
        $stmt->bindParam(':brand', $brand);
        $stmt->bindParam(':color', $color);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->bindParam(':customer_id', $customer_id, PDO::PARAM_INT);

        return $stmt->execute();
    }

    public function delete($id, $customer_id) {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = :id AND customer_id = :customer_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->bindParam(':customer_id', $customer_id, PDO::PARAM_INT);
        return $stmt->execute();
    }

    public function exists($customer_id, $brand, $color) {
        $query = "SELECT id FROM " . $this->table_name . " WHERE customer_id = :customer_id AND LOWER(brand) = LOWER(:brand) AND LOWER(color) = LOWER(:color) LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':customer_id', $customer_id, PDO::PARAM_INT);
        $stmt->bindParam(':brand', $brand);
        $stmt->bindParam(':color', $color);
        $stmt->execute();
        return $stmt->rowCount() > 0;
    }
}
?>
