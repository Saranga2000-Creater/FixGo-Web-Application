<?php
class ServiceRequest {
    private $conn;
    private $table_name = 'servicerequest';

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

        $customer_id         = htmlspecialchars(strip_tags($data['customer_id']));
        $shop_id             = htmlspecialchars(strip_tags($data['shop_id']));
        $vehicle_category_id = htmlspecialchars(strip_tags($data['vehicle_category_id']));
        $vehicle_brand       = htmlspecialchars(strip_tags($data['vehicle_brand'] ?? 'Unknown'));
        $vehicle_color       = htmlspecialchars(strip_tags($data['vehicle_color'] ?? 'Unknown'));
        $description         = htmlspecialchars(strip_tags($data['description'] ?? ''));
        $requires_tow        = !empty($data['requires_tow']) ? 1 : 0;
        $photo               = isset($data['photo']) ? $data['photo'] : null;
        $urgency_level       = htmlspecialchars(strip_tags($data['urgency_level'] ?? 'Normal'));
        $issue_category      = isset($data['issue_category'])  ? htmlspecialchars(strip_tags($data['issue_category']))  : null;
        $pickup_landmark     = isset($data['pickup_landmark'])  ? htmlspecialchars(strip_tags($data['pickup_landmark'])) : null;
        $preferred_date      = isset($data['preferred_date'])   ? htmlspecialchars(strip_tags($data['preferred_date']))  : null;
        $preferred_time      = isset($data['preferred_time'])   ? htmlspecialchars(strip_tags($data['preferred_time']))  : null;

        $lat         = isset($data['lat']) ? (float)$data['lat'] : 0;
        $lng         = isset($data['lng']) ? (float)$data['lng'] : 0;
        $pointString = "POINT({$lng} {$lat})";

        $stmt->bindParam(":customer_id",         $customer_id);
        $stmt->bindParam(":shop_id",             $shop_id);
        $stmt->bindParam(":vehicle_category_id", $vehicle_category_id);
        $stmt->bindParam(":vehicle_brand",       $vehicle_brand);
        $stmt->bindParam(":vehicle_color",       $vehicle_color);
        $stmt->bindParam(":description",         $description);
        $stmt->bindParam(":requires_tow",        $requires_tow);
        $stmt->bindParam(":photo",               $photo);
        $stmt->bindParam(":location",            $pointString);
        $stmt->bindParam(":urgency_level",       $urgency_level);
        $stmt->bindParam(":issue_category",      $issue_category);
        $stmt->bindParam(":pickup_landmark",     $pickup_landmark);
        $stmt->bindParam(":preferred_date",      $preferred_date);
        $stmt->bindParam(":preferred_time",      $preferred_time);

        if ($stmt->execute()) {
            return $this->conn->lastInsertId();
        }
        return false;
    }

    public function getById($request_id) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE id = :id LIMIT 1";
        $stmt  = $this->conn->prepare($query);
        $stmt->bindParam(":id", $request_id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // ==========================================
    // 1. LIMITERS & SPAM PREVENTION
    // ==========================================

    public function hasAPendingRequest($customer_id, $shop_id) {
        $query = "SELECT id FROM " . $this->table_name . " 
                  WHERE customer_id = :customer_id AND shop_id = :shop_id AND status IN ('Pending', 'Accepted')
                  LIMIT 1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":customer_id", $customer_id, PDO::PARAM_INT);
        $stmt->bindParam(":shop_id",     $shop_id,     PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->rowCount() > 0;
    }

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

    public function updateStatus($request_id, $new_status) {
        $timestampColumn = "";

        if ($new_status === 'Accepted')  $timestampColumn = ", accepted_at = NOW()";
        if ($new_status === 'Confirmed') $timestampColumn = ", confirmed_at = NOW()";
        if ($new_status === 'Completed') $timestampColumn = ", completed_at = NOW()";

        $query = "UPDATE " . $this->table_name . " 
                  SET status = :status {$timestampColumn} 
                  WHERE id = :id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":status", $new_status);
        $stmt->bindParam(":id",     $request_id, PDO::PARAM_INT);

        return $stmt->execute();
    }



    // ==========================================
    // 3. CANCELLATION & ACCOUNTABILITY
    // ==========================================

    public function cancelRequest($request_id, $cancelled_by, $reason) {
        $query = "UPDATE " . $this->table_name . " 
                  SET status              = 'Cancelled', 
                      cancelled_at        = NOW(), 
                      cancelled_by        = :by, 
                      cancellation_reason = :reason 
                  WHERE id = :id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":by",     $cancelled_by);
        $stmt->bindParam(":reason", $reason);
        $stmt->bindParam(":id",     $request_id, PDO::PARAM_INT);

        return $stmt->execute();
    }


public function declineRequest($request_id, $reason) {
    $query = "UPDATE " . $this->table_name . " 
              SET status              = 'Declined', 
                  cancelled_at        = NOW(), 
                  cancelled_by        = 'Shop', 
                  cancellation_reason = :reason 
              WHERE id = :id";

    $stmt = $this->conn->prepare($query);
    $stmt->bindParam(":reason", $reason);
    $stmt->bindParam(":id",     $request_id, PDO::PARAM_INT);

    return $stmt->execute();
}

public function getDeclinedRequestsByShop($shop_id) {
    $query = "SELECT sr.*, 
                     c.name          as customer_name, 
                     c.contactNumber as customer_phone 
              FROM " . $this->table_name . " sr
              LEFT JOIN customer c ON sr.customer_id = c.id
              WHERE sr.shop_id = :shop_id
              AND sr.status = 'Declined'
              ORDER BY sr.cancelled_at DESC";

    $stmt = $this->conn->prepare($query);
    $stmt->bindParam(":shop_id", $shop_id, PDO::PARAM_INT);
    $stmt->execute();

    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    foreach ($results as &$row) {
        unset($row['location']);
    }
    return $results;
}

    public function cancelCompetingRequests($customer_id, $winning_request_id) {
        $reason = "Customer confirmed a different shop for this incident.";
        $by     = "System";

        $query = "UPDATE " . $this->table_name . " 
                  SET status              = 'Cancelled', 
                      cancelled_at        = NOW(), 
                      cancelled_by        = :by, 
                      cancellation_reason = :reason 
                  WHERE customer_id = :customer_id 
                  AND id            != :winning_id 
                  AND status        = 'Pending'";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":by",          $by);
        $stmt->bindParam(":reason",      $reason);
        $stmt->bindParam(":customer_id", $customer_id,       PDO::PARAM_INT);
        $stmt->bindParam(":winning_id",  $winning_request_id, PDO::PARAM_INT);

        return $stmt->execute();
    }

    //Database cleanup: Cancel stale requests that have been pending for too long. For clear statistics generation
    public function cancelStaleRequests() {
        $query = "
            UPDATE " . $this->table_name . " 
            SET status = 'Cancelled', 
                cancelled_by = 'System', 
                cancellation_reason = 'Automatically cancelled due to shop inactivity'
            WHERE status = 'Pending' 
            AND (
                /* Tier 1: Urgent requests older than 30 minutes */
                (urgency_level = 'Urgent' AND created_at <= DATE_SUB(NOW(), INTERVAL 30 MINUTE))
                OR 
                /* Tier 2: Normal requests older than 24 hours */
                (urgency_level = 'Normal' AND preferred_date IS NULL AND created_at <= DATE_SUB(NOW(), INTERVAL 24 HOUR))
                OR
                /* Tier 3: Appointments where the requested date has already passed */
                (preferred_date IS NOT NULL AND preferred_date < CURDATE())
            )
        ";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();
    }

    // ==========================================
    // 4. DASHBOARD RETRIEVAL QUERIES
    // ==========================================

    public function getRequestsByCustomer($customer_id) {
        $query = "SELECT sr.*, 
                         s.name          as shop_name, 
                         s.contactNumber as shop_phone 
                  FROM " . $this->table_name . " sr
                  LEFT JOIN shop s ON sr.shop_id = s.id
                  WHERE sr.customer_id = :customer_id
                  ORDER BY sr.created_at DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":customer_id", $customer_id, PDO::PARAM_INT);
        $stmt->execute();

        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

        foreach ($results as &$row) {
            unset($row['location']);
        }

        return $results;
    }

    public function getRequestsByShop($shop_id) {
        //Explicitly extract ST_Y (Latitude) and ST_X (Longitude)
        $query = "SELECT sr.*, 
                         ST_Y(sr.location) AS customer_lat,
                         ST_X(sr.location) AS customer_lng,
                         c.name          as customer_name, 
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
            sr.id,
            sr.customer_id,
            sr.shop_id,
            sr.vehicle_brand,
            sr.vehicle_color,
            sr.issue_category,
            sr.description,
            sr.status,
            sr.urgency_level,
            sr.requires_tow,       
            sr.pickup_landmark,   
            sr.dispatched_driver_phone, 
            ST_Y(sr.location) AS customer_lat, 
            ST_X(sr.location) AS customer_lng,
            c.name AS customer_name,
            c.contactNumber AS customer_phone
        FROM servicerequest sr
        LEFT JOIN customer c
            ON sr.customer_id = c.id
        WHERE sr.shop_id = :shop_id
          AND sr.status IN ('Confirmed','In Progress')
        ORDER BY sr.created_at DESC
    ";

    $stmt = $this->conn->prepare($query);
    $stmt->bindParam(':shop_id', $shop_id, PDO::PARAM_INT);
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
            ':id'     => $request_id
        ]);
    }

    public function getServiceHistoryByShop($shop_id)
{
    $query = "
        SELECT
             sr.id,
            sr.status,
            sr.vehicle_brand,
            sr.vehicle_color,
            sr.description,
            sr.issue_category,
            sr.photo,
            sr.created_at,
            sr.confirmed_at,
            sr.completed_at,
            c.name          AS customer_name,
            c.contactNumber AS customer_phone
        FROM servicerequest sr
        LEFT JOIN customer c ON sr.customer_id = c.id
        WHERE sr.shop_id = :shop_id
        AND sr.status = 'Completed'
        ORDER BY sr.completed_at DESC
    ";

    $stmt = $this->conn->prepare($query);
    $stmt->bindParam(':shop_id', $shop_id);
    $stmt->execute();

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

public function updateTowTruckDetails($data)
{
    $sql = "
    UPDATE servicerequest
    SET
        dispatched_driver_name  = ?,
        dispatched_driver_phone = ?,
        dispatched_truck_brand  = ?,
        dispatched_truck_color  = ?,
        dispatched_truck_plate  = ?,
        promised_eta            = ?
    WHERE id = ?";

    $stmt = $this->conn->prepare($sql);

    $result = $stmt->execute([
        $data["driver_name"],
        $data["driver_phone"],
        $data["truck_brand"],
        $data["truck_color"],
        $data["truck_plate"],
        $data["promised_eta"] ?? null,
        $data["request_id"]
    ]);

    return $result;
}

    // ==========================================
    // 5. CUSTOMER-SIDE HISTORY
    // ==========================================

    public function getServiceHistoryByCustomer($customer_id)
    {
        $query = "
            SELECT
                sr.id,
                sr.status,
                sr.vehicle_brand,
                sr.vehicle_color,
                sr.description,
                sr.issue_category,
                sr.created_at,
                sr.completed_at,
                s.name    AS shop_name,
                s.address AS shop_address
            FROM servicerequest sr
            LEFT JOIN shop s ON sr.shop_id = s.id
            WHERE sr.customer_id = :customer_id
            AND sr.status = 'Completed'
            ORDER BY sr.completed_at DESC
        ";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':customer_id', $customer_id, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

   



}
?>