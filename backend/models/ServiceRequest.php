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
        // UPDATE 1: Added 'photo' to the columns and ':photo' to the VALUES
        $query = "INSERT INTO " . $this->table_name . " (
                    customer_id, 
                    shop_id, 
                    vehicle_category_id, 
                    vehicle_brand, 
                    vehicle_color, 
                    description, 
                    requires_tow, 
                    photo, 
                    location, 
                    status,
                    urgency_level,
                    issue_category,
                    pickup_landmark,
                    preferred_date, 
                    preferred_time
                  ) VALUES (
                    :customer_id, 
                    :shop_id, 
                    :vehicle_category_id, 
                    :vehicle_brand, 
                    :vehicle_color, 
                    :description, 
                    :requires_tow, 
                    :photo, 
                    ST_GeomFromText(:location), 
                    'Pending',
                    :urgency_level,
                    :issue_category,
                    :pickup_landmark,
                    :preferred_date,
                    :preferred_time
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
        
        // UPDATE 2: Safely extract the photo path (will be null if no image was uploaded)
        $photo = isset($data['photo']) ? $data['photo'] : null;

        $urgency_level = htmlspecialchars(strip_tags($data['urgency_level'] ?? 'Normal'));
        $issue_category = isset($data['issue_category']) ? htmlspecialchars(strip_tags($data['issue_category'])) : null;
        $pickup_landmark = isset($data['pickup_landmark']) ? htmlspecialchars(strip_tags($data['pickup_landmark'])) : null;
        $preferred_date = isset($data['preferred_date']) ? htmlspecialchars(strip_tags($data['preferred_date'])) : null;
        $preferred_time = isset($data['preferred_time']) ? htmlspecialchars(strip_tags($data['preferred_time'])) : null;

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
        
        // UPDATE 3: Bind the photo parameter to the SQL statement
        $stmt->bindParam(":photo", $photo);
        
        $stmt->bindParam(":location", $pointString);

        $stmt->bindParam(":urgency_level", $urgency_level);
        $stmt->bindParam(":issue_category", $issue_category);
        $stmt->bindParam(":pickup_landmark", $pickup_landmark);
        $stmt->bindParam(":preferred_date", $preferred_date);
        $stmt->bindParam(":preferred_time", $preferred_time);

        if ($stmt->execute()) {
            return $this->conn->lastInsertId();
        }
        return false;
    }
}
?>