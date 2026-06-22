<?php
class ServiceRequest {
    private $conn;
    private $table_name = 'serviceRequest';

    public function __construct($db) {
        $this->conn = $db;
    }

    // Checks if the customer already has an active request waiting for a shop
    public function hasPendingRequest($customerId, $shopId)
{
    $query = "
        SELECT id
        FROM servicerequest
        WHERE customer_id = :customer_id
        AND shop_id = :shop_id
        AND status = 'Pending'
        LIMIT 1
    ";

    $stmt = $this->conn->prepare($query);

    $stmt->bindParam(':customer_id', $customerId);
    $stmt->bindParam(':shop_id', $shopId);

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

    // Fetch a single request by ID to check its current state
    public function getById($request_id) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE id = :id LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $request_id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // ==========================================
    // 1. LIMITERS & SPAM PREVENTION
    // ==========================================
    
    // Checks if the customer already sent a request to THIS SPECIFIC shop
    public function hasAPendingRequest($customer_id, $shop_id) {
        $query = "SELECT id FROM " . $this->table_name . " 
                  WHERE customer_id = :customer_id AND shop_id = :shop_id AND status IN ('Pending', 'Accepted')
                  LIMIT 1";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":customer_id", $customer_id, PDO::PARAM_INT);
        $stmt->bindParam(":shop_id", $shop_id, PDO::PARAM_INT);
        $stmt->execute();
        
        return $stmt->rowCount() > 0;
    }

    // Checks how many total active requests the customer has across ALL shops (Limit 5)
    public function getActiveBroadcastCount($customer_id) {
        $query = "SELECT COUNT(id) as total FROM " . $this->table_name . " 
                  WHERE customer_id = :customer_id AND status IN ('Pending', 'Accepted')";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":customer_id", $customer_id, PDO::PARAM_INT);
        $stmt->execute();
        
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return (int) $row['total'];
    }

    // ==========================================
    // 2. STATUS & HANDSHAKE UPDATERS
    // ==========================================

    // Master status updater with dynamic timestamp injection
    public function updateStatus($request_id, $new_status) {
        $timestampColumn = "";
        
        // Match the status to the correct tracking column
        if ($new_status === 'Accepted') $timestampColumn = ", accepted_at = NOW()";
        if ($new_status === 'Confirmed') $timestampColumn = ", confirmed_at = NOW()";
        if ($new_status === 'Completed') $timestampColumn = ", completed_at = NOW()";

        $query = "UPDATE " . $this->table_name . " 
                  SET status = :status {$timestampColumn} 
                  WHERE id = :id";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":status", $new_status);
        $stmt->bindParam(":id", $request_id, PDO::PARAM_INT);
        
        return $stmt->execute();
    }

    // Captures the tow truck dispatch details when a garage accepts
    public function updateTowDetails($request_id, $eta, $truck_brand, $truck_color, $truck_plate, $driver_name, $driver_phone) {
        $query = "UPDATE " . $this->table_name . " 
                  SET promised_eta = :eta, 
                      dispatched_truck_brand = :truck_brand,
                      dispatched_truck_color = :truck_color,
                      dispatched_truck_plate = :truck_plate,
                      dispatched_driver_name = :driver_name,
                      dispatched_driver_phone = :driver_phone
                  WHERE id = :id";
                  
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":eta", $eta, PDO::PARAM_INT);
        $stmt->bindParam(":truck_brand", $truck_brand);
        $stmt->bindParam(":truck_color", $truck_color);
        $stmt->bindParam(":truck_plate", $truck_plate);
        $stmt->bindParam(":driver_name", $driver_name);
        $stmt->bindParam(":driver_phone", $driver_phone);
        $stmt->bindParam(":id", $request_id, PDO::PARAM_INT);
        
        return $stmt->execute();
    }

    // ==========================================
    // 3. CANCELLATION & ACCOUNTABILITY
    // ==========================================

    // Standard cancellation (logs who cancelled and why)
    public function cancelRequest($request_id, $cancelled_by, $reason) {
        $query = "UPDATE " . $this->table_name . " 
                  SET status = 'Cancelled', 
                      cancelled_at = NOW(), 
                      cancelled_by = :by, 
                      cancellation_reason = :reason 
                  WHERE id = :id";
                  
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":by", $cancelled_by);
        $stmt->bindParam(":reason", $reason);
        $stmt->bindParam(":id", $request_id, PDO::PARAM_INT);
        
        return $stmt->execute();
    }

    // The Auto-Kill switch: Cancels competing requests when the handshake is confirmed
    public function cancelCompetingRequests($customer_id, $winning_request_id) {
        $reason = "Customer confirmed a different shop for this incident.";
        $by = "System";
        
        $query = "UPDATE " . $this->table_name . " 
                  SET status = 'Cancelled', 
                      cancelled_at = NOW(), 
                      cancelled_by = :by, 
                      cancellation_reason = :reason 
                  WHERE customer_id = :customer_id 
                  AND id != :winning_id 
                  AND status = 'Pending'";
                  
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":by", $by);
        $stmt->bindParam(":reason", $reason);
        $stmt->bindParam(":customer_id", $customer_id, PDO::PARAM_INT);
        $stmt->bindParam(":winning_id", $winning_request_id, PDO::PARAM_INT);
        
        return $stmt->execute();
    }

    // ==========================================
    // 4. DASHBOARD RETRIEVAL QUERIES
    // ==========================================

    public function getRequestsByCustomer($customer_id) {
        $query = "SELECT sr.*, 
                         s.name as shop_name, 
                         s.contactNumber as shop_phone 
                  FROM " . $this->table_name . " sr
                  LEFT JOIN shop s ON sr.shop_id = s.id
                  WHERE sr.customer_id = :customer_id
                  ORDER BY sr.created_at DESC";
                  
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":customer_id", $customer_id, PDO::PARAM_INT);
        $stmt->execute();
        
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // FIX: Remove raw binary spatial data so json_encode doesn't crash
        foreach ($results as &$row) {
            unset($row['location']);
        }
        
        return $results;
    }

    public function getRequestsByShop($shop_id) {
        $query = "SELECT sr.*, 
                         c.name as customer_name, 
                         c.contactNumber as customer_phone 
                  FROM " . $this->table_name . " sr
                  LEFT JOIN customer c ON sr.customer_id = c.id
                  WHERE sr.shop_id = :shop_id
                  AND sr.status IN ('Pending', 'Accepted')
                  ORDER BY sr.created_at DESC";
                  
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":shop_id", $shop_id, PDO::PARAM_INT);
        $stmt->execute();
        
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // FIX: Remove raw binary spatial data so json_encode doesn't crash
        foreach ($results as &$row) {
            unset($row['location']);
        }
        
        return $results;
    }
  public function getConfirmedRequestsByShop($shop_id)
{
    $query = "
        SELECT sr.id,
               c.name AS customer_name,
               sr.vehicle_brand
        FROM servicerequest sr
        JOIN customer c ON sr.customer_id = c.id
        WHERE sr.shop_id = :shop_id
        AND sr.status = 'Confirmed'
        ORDER BY sr.confirmed_at DESC
    ";

    $stmt = $this->conn->prepare($query);
    $stmt->bindParam(':shop_id', $shop_id);
    $stmt->execute();

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
} 

public function getActiveRepairsByShop($shop_id)
{
    $query = "
        SELECT
            sr.*,
            c.name AS customer_name,
            c.contactNumber AS customer_phone
        FROM servicerequest sr
        LEFT JOIN customer c
            ON sr.customer_id = c.id
        WHERE sr.shop_id = :shop_id
        AND sr.status IN (
            'Confirmed',
            'In Progress'
        )
        ORDER BY sr.created_at DESC
    ";

    $stmt = $this->conn->prepare($query);
    $stmt->bindParam(':shop_id', $shop_id);
    $stmt->execute();

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}
public function updateRepairStatus($request_id, $status)
{
    $query = "
        UPDATE servicerequest
        SET status = :status
        WHERE id = :id
    ";

    $stmt = $this->conn->prepare($query);

    return $stmt->execute([
        ':status' => $status,
        ':id' => $request_id
    ]);
}
public function getServiceHistoryByShop($shop_id)
{
    $query = "
        SELECT
            sr.*,
            c.name AS customer_name,
            c.contactNumber AS customer_phone
        FROM servicerequest sr
        LEFT JOIN customer c
            ON sr.customer_id = c.id
        WHERE sr.shop_id = :shop_id
        AND sr.status = 'Completed'
        ORDER BY sr.completed_at DESC
    ";

    $stmt = $this->conn->prepare($query);
    $stmt->bindParam(':shop_id', $shop_id);
    $stmt->execute();

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

}
?>