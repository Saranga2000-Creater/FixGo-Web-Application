<?php
class ServiceRequest {
    private $conn;
    private $table_name = 'serviceRequest';

    public function __construct($db) {
        $this->conn = $db;
    }

    // Checks if the customer already has an active request waiting for a shop
    public function hasPendingRequest($customer_id) {
        $query = "SELECT id FROM " . $this->table_name . " 
                  WHERE customer_id = :customer_id AND status = 'Pending' 
                  LIMIT 1";
        
        $stmt = $this->conn->prepare($query);
        $customer_id = htmlspecialchars(strip_tags($customer_id));
        $stmt->bindParam(":customer_id", $customer_id);
        $stmt->execute();
        
        return $stmt->rowCount() > 0;
    }

    public function create($data) {
        $query = "INSERT INTO " . $this->table_name . " (
                    customer_id, 
                    shop_id, 
                    vehicle_category_id, 
                    vehicle_brand, 
                    vehicle_color, 
                    description, 
                    requires_tow, 
                    location, 
                    status
                  ) VALUES (
                    :customer_id, 
                    :shop_id, 
                    :vehicle_category_id, 
                    :vehicle_brand, 
                    :vehicle_color, 
                    :description, 
                    :requires_tow, 
                    ST_GeomFromText(:location), 
                    'Pending'
                  )";

        $stmt = $this->conn->prepare($query);

        // Sanitize
        $customer_id = htmlspecialchars(strip_tags($data['customer_id']));
        $shop_id = htmlspecialchars(strip_tags($data['shop_id']));
        $vehicle_category_id = htmlspecialchars(strip_tags($data['vehicle_category_id']));
        $vehicle_brand = htmlspecialchars(strip_tags($data['vehicle_brand'] ?? 'Unknown'));
        $vehicle_color = htmlspecialchars(strip_tags($data['vehicle_color'] ?? 'Unknown'));
        $description = htmlspecialchars(strip_tags($data['description'] ?? ''));
        $requires_tow = !empty($data['requires_tow']) ? 1 : 0;

        // Format Spatial Data
        $lat = isset($data['lat']) ? (float)$data['lat'] : 0;
        $lng = isset($data['lng']) ? (float)$data['lng'] : 0;
        $pointString = "POINT({$lng} {$lat})";

        // Bind parameters
        $stmt->bindParam(":customer_id", $customer_id);
        $stmt->bindParam(":shop_id", $shop_id);
        $stmt->bindParam(":vehicle_category_id", $vehicle_category_id);
        $stmt->bindParam(":vehicle_brand", $vehicle_brand);
        $stmt->bindParam(":vehicle_color", $vehicle_color);
        $stmt->bindParam(":description", $description);
        $stmt->bindParam(":requires_tow", $requires_tow);
        $stmt->bindParam(":location", $pointString);

        if ($stmt->execute()) {
            return $this->conn->lastInsertId();
        }
        return false;
    }
}
?>