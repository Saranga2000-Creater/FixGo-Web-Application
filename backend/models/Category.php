<?php
class Category {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Fetch Vehicle Categories
    public function getVehicleCategories() {
        $query = "SELECT id, name as label FROM vehicleCategory ORDER BY id ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    // Fetch Shop Services
    public function getShopServices() {
        $query = "SELECT id, name as label FROM shopCategory ORDER BY id ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }
}
?>