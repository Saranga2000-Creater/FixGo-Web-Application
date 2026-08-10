<?php
class Category {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Fetch Vehicle Categories
    public function getVehicleCategories() {
        $query = "SELECT id, name, name as label FROM vehicleCategory ORDER BY id ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    // Fetch Shop Services
    public function getShopServices() {
        $query = "SELECT id, name, name as label FROM shopCategory ORDER BY id ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    // ── Shop Categories CRUD ──────────────────────────────────────────

    public function getAllShopCategories() {
        $stmt = $this->conn->prepare("SELECT id, name, description FROM shopCategory ORDER BY id ASC");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function isShopCategoryNameTaken($name, $excludeId = null) {
        $sql = "SELECT id FROM shopCategory WHERE LOWER(name) = LOWER(:name)";
        $params = [':name' => trim($name)];
        if ($excludeId) {
            $sql .= " AND id != :excludeId";
            $params[':excludeId'] = $excludeId;
        }
        $stmt = $this->conn->prepare($sql);
        $stmt->execute($params);
        return (bool)$stmt->fetch();
    }

    public function addShopCategory($name, $description = '') {
        $stmt = $this->conn->prepare("INSERT INTO shopCategory (name, description) VALUES (:name, :description)");
        $stmt->execute([
            ':name' => trim($name),
            ':description' => trim($description)
        ]);
        return $this->conn->lastInsertId();
    }

    public function updateShopCategory($id, $name, $description = '') {
        $stmt = $this->conn->prepare("UPDATE shopCategory SET name = :name, description = :description WHERE id = :id");
        return $stmt->execute([
            ':id' => $id,
            ':name' => trim($name),
            ':description' => trim($description)
        ]);
    }

    public function deleteShopCategory($id) {
        $stmt = $this->conn->prepare("DELETE FROM shopCategory WHERE id = :id");
        return $stmt->execute([':id' => $id]);
    }

    // ── Vehicle Categories CRUD ───────────────────────────────────────

    public function getAllVehicleCategoriesList() {
        $stmt = $this->conn->prepare("SELECT id, name, description FROM vehicleCategory ORDER BY id ASC");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function isVehicleCategoryNameTaken($name, $excludeId = null) {
        $sql = "SELECT id FROM vehicleCategory WHERE LOWER(name) = LOWER(:name)";
        $params = [':name' => trim($name)];
        if ($excludeId) {
            $sql .= " AND id != :excludeId";
            $params[':excludeId'] = $excludeId;
        }
        $stmt = $this->conn->prepare($sql);
        $stmt->execute($params);
        return (bool)$stmt->fetch();
    }

    public function addVehicleCategory($name, $description = '') {
        $stmt = $this->conn->prepare("INSERT INTO vehicleCategory (name, description) VALUES (:name, :description)");
        $stmt->execute([
            ':name' => trim($name),
            ':description' => trim($description)
        ]);
        return $this->conn->lastInsertId();
    }

    public function updateVehicleCategory($id, $name, $description = '') {
        $stmt = $this->conn->prepare("UPDATE vehicleCategory SET name = :name, description = :description WHERE id = :id");
        return $stmt->execute([
            ':id' => $id,
            ':name' => trim($name),
            ':description' => trim($description)
        ]);
    }

    public function deleteVehicleCategory($id) {
        $stmt = $this->conn->prepare("DELETE FROM vehicleCategory WHERE id = :id");
        return $stmt->execute([':id' => $id]);
    }

    public function resolveShopCategoryId($identifier) {
        if (is_numeric($identifier)) {
            $stmt = $this->conn->prepare("SELECT id FROM shopCategory WHERE id = :id LIMIT 1");
            $stmt->execute([':id' => (int)$identifier]);
        } else {
            $stmt = $this->conn->prepare("SELECT id FROM shopCategory WHERE LOWER(name) = LOWER(:name) LIMIT 1");
            $stmt->execute([':name' => trim($identifier)]);
        }
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row ? (int)$row['id'] : null;
    }

    public function resolveVehicleCategoryId($identifier) {
        if (is_numeric($identifier)) {
            $stmt = $this->conn->prepare("SELECT id FROM vehicleCategory WHERE id = :id LIMIT 1");
            $stmt->execute([':id' => (int)$identifier]);
        } else {
            $stmt = $this->conn->prepare("SELECT id FROM vehicleCategory WHERE LOWER(name) = LOWER(:name) LIMIT 1");
            $stmt->execute([':name' => trim($identifier)]);
        }
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row ? (int)$row['id'] : null;
    }
}
?>