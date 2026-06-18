<?php
class Shop {
    private $conn;
    private $table_name = 'shop'; 

    public function __construct($db) {
        $this->conn = $db;
    }

    // ==========================================
    // Dashboard Profile Retrieval
    // ==========================================
  public function getById($shopId) {

    $query = "
        SELECT
            u.id,
            u.email,
            s.name,
            s.owner,
            s.address,
            s.contactNumber,
            s.description,
            s.openTime,
            s.closeTime,
            s.isAvailable,
            s.carriageService,
            s.BRN,
            s.profileImageURL,
            GROUP_CONCAT(DISTINCT sc.name SEPARATOR ', ') AS categories
        FROM users u
        INNER JOIN shop s ON u.id = s.id
        LEFT JOIN shopCategoryMapping scm ON scm.shop_id = s.id
        LEFT JOIN shopCategory sc ON sc.id = scm.shop_category_id
        WHERE u.id = :id
        GROUP BY
            u.id,
            u.email,
            s.name,
            s.owner,
            s.address,
            s.contactNumber,
            s.description,
            s.openTime,
            s.closeTime,
            s.isAvailable,
            s.carriageService,
            s.BRN,
            s.profileImageURL
    ";

    $stmt = $this->conn->prepare($query);
    $stmt->execute([':id' => $shopId]);

    return $stmt->fetch(PDO::FETCH_ASSOC);
}

    // ==========================================
    // Find Nearby Shops (Search UI)
    // ==========================================
    public function findNearby($lat, $lng, $radiusInKm, $vehicleCategoryId = null, $shopCategoryId = null, $sortBy = 'distance', $searchName = null, $needs_tow = 'false', $quickFilter = 'all', $currentTime = null) {
        $radiusInMeters = $radiusInKm * 1000;

        // CHANGED: Updated has_tow_service to carriageService to match DB changes
        $query = "SELECT 
                    s.id, 
                    s.name, 
                    s.address, 
                    s.openTime, 
                    s.closeTime, 
                    s.isAvailable,
                    s.profileImageURL as thumbnail_url,
                    ST_Y(s.location) as latitude, 
                    ST_X(s.location) as longitude,
                    ST_Distance_Sphere(s.location, POINT(:lng, :lat)) AS distance,
                    COALESCE(ROUND(AVG(r.rating), 1), 0) as avg_rating,
                    COUNT(r.id) as review_count,
                    (SELECT COUNT(*) FROM serviceRequest sr WHERE sr.shop_id = s.id AND sr.status = 'Completed') as services_completed,
                    (SELECT COALESCE(ROUND(AVG(TIMESTAMPDIFF(MINUTE, sr.created_at, sr.accepted_at))), 15) 
                     FROM serviceRequest sr 
                     WHERE sr.shop_id = s.id AND sr.accepted_at IS NOT NULL) as response_time_minutes,
                    GROUP_CONCAT(DISTINCT sc.name SEPARATOR ', ') as shop_tags,
                    GROUP_CONCAT(DISTINCT vc.name SEPARATOR ', ') as vehicle_tags
                  FROM " . $this->table_name . " s
                  LEFT JOIN review r ON s.id = r.shop_id
                  LEFT JOIN shopCategoryMapping scm ON s.id = scm.shop_id
                  LEFT JOIN shopCategory sc ON scm.shop_category_id = sc.id
                  LEFT JOIN shopVehicleCategories svc_all ON s.id = svc_all.shop_id
                  LEFT JOIN vehicleCategory vc ON svc_all.vehicle_category_id = vc.id";

        if ($vehicleCategoryId !== null) {
            $query .= " INNER JOIN shopVehicleCategories svc_filter ON s.id = svc_filter.shop_id ";
        }

        $query .= " WHERE ST_Distance_Sphere(s.location, POINT(:lng, :lat)) <= :radius ";

        // CHANGED: Updated has_tow_service to carriageService
        if ($needs_tow === 'true') {
            $query .= " AND s.carriageService = 1 ";
        }

        if ($vehicleCategoryId !== null) {
            $query .= " AND svc_filter.vehicle_category_id = :vehicle_category ";
        }
        if ($shopCategoryId !== null) {
            $query .= " AND scm.shop_category_id = :shop_category ";
        }
        if ($searchName !== null && $searchName !== '') {
            $query .= " AND s.name LIKE :searchName ";
        }

        // CHANGED: Updated has_tow_service to carriageService
        if ($quickFilter === 'open') {
            $query .= " AND s.isAvailable = 1 AND :currentTime BETWEEN s.openTime AND s.closeTime ";
        } elseif ($quickFilter === 'roadside') {
            $query .= " AND s.carriageService = 1 ";
        }

        $query .= " GROUP BY s.id ";

        if ($quickFilter === 'top_rated') {
            $query .= " HAVING avg_rating >= 4.0 ";
        }

        if ($quickFilter === 'nearest') {
            $query .= " ORDER BY distance ASC"; 
        } else if ($sortBy === 'rating') {
            $query .= " ORDER BY avg_rating DESC, distance ASC";
        } else {
            $query .= " ORDER BY distance ASC";
        }

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(':lat', $lat, PDO::PARAM_STR);
        $stmt->bindParam(':lng', $lng, PDO::PARAM_STR);
        $stmt->bindParam(':radius', $radiusInMeters, PDO::PARAM_STR);

        if ($vehicleCategoryId !== null) {
            $stmt->bindParam(':vehicle_category', $vehicleCategoryId, PDO::PARAM_INT);
        }
        if ($shopCategoryId !== null) {
            $stmt->bindParam(':shop_category', $shopCategoryId, PDO::PARAM_INT);
        }

        if ($searchName !== null && $searchName !== '') {
            $searchTerm = '%' . $searchName . '%';
            $stmt->bindParam(':searchName', $searchTerm, PDO::PARAM_STR);
        }

        if ($quickFilter === 'open') {
            $stmt->bindParam(':currentTime', $currentTime, PDO::PARAM_STR);
        }

        $stmt->execute();
        return $stmt;
    }

    // ==========================================
    // Shop Description Page 
    // ==========================================
    public function getShopDetails($shopId, $customerId = null) {
        $details = [];

        // 1. Get Core Info (Fixed SQL ambiguity: `address`, not `address as location`, and `shop.location`)
        $query = "SELECT id, name, address, contactNumber as phone, description, 
                         openTime, closeTime, isAvailable, carriageService,
                         ST_Y(shop.location) as lat, ST_X(shop.location) as lng
                  FROM shop WHERE id = :id LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $shopId);
        $stmt->execute();
        $info = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$info) return null;

        // 2. PRIVACY CHECK: Has the 3-Way Handshake been completed?
        $details['isHandshakeComplete'] = false; // Default to false
        if ($customerId) {
            // Check if there is an ACCEPTED service request between this customer and this shop
            $checkHandshake = "SELECT id FROM serviceRequest 
                               WHERE customer_id = :cid AND shop_id = :sid AND status = 'Accepted' 
                               LIMIT 1";
            $handshakeStmt = $this->conn->prepare($checkHandshake);
            $handshakeStmt->bindParam(':cid', $customerId);
            $handshakeStmt->bindParam(':sid', $shopId);
            $handshakeStmt->execute();
            if ($handshakeStmt->fetchColumn()) {
                $details['isHandshakeComplete'] = true;
            }
        }

        // 3. SECURE DATA ROUTING & COORDINATE FUZZING
        if ($details['isHandshakeComplete']) {
            // UNLOCKED: Give them the exact address and exact map coordinates
            $info['location'] = $info['address'];
            $info['mapQuery'] = ($info['lat'] && $info['lng']) ? $info['lat'] . ',' . $info['lng'] : $info['address'];
        } else {
            // LOCKED: Mask the phone number
            $info['phone'] = 'Protected (Available after booking)';
            
            // Extract generalized area for text display
            $addressParts = explode(',', $info['address']);
            $generalizedArea = trim(end($addressParts)); 
            if (count($addressParts) > 1) {
                $generalizedArea = trim($addressParts[count($addressParts)-2]) . ', ' . $generalizedArea;
            }
            $info['location'] = $generalizedArea ;
            
            // THE MAGIC: COORDINATE FUZZING (Jitter)
            if ($info['lat'] && $info['lng']) {
                // Generate a random offset between -0.005 and 0.005 degrees (roughly a 500m radius)
                $offsetLat = (mt_rand(-50, 50) / 10000);
                $offsetLng = (mt_rand(-50, 50) / 10000);
                
                // Add the fake offset to the real coordinates
                $safeLat = $info['lat'] + $offsetLat;
                $safeLng = $info['lng'] + $offsetLng;
                
                // Send the fuzzed coordinates to the frontend map!
                $info['mapQuery'] = $safeLat . ',' . $safeLng;
            } else {
                $info['mapQuery'] = $generalizedArea;
            }
        }

        // Remove the raw exact data so it is never accidentally sent in the JSON payload
        unset($info['address']);
        unset($info['lat']);
        unset($info['lng']);
        
        $details['info'] = $info;

        // 4. Get Services
        $svcQuery = "SELECT service_name as name, starting_price as price, duration 
                     FROM shopServices WHERE shop_id = :id";
        $svcStmt = $this->conn->prepare($svcQuery);
        $svcStmt->bindParam(':id', $shopId);
        $svcStmt->execute();
        $details['services'] = $svcStmt->fetchAll(PDO::FETCH_ASSOC);

        // 5. Get Reviews (We need the raw rating to filter on the frontend later)
        $revQuery = "SELECT r.rating, r.comment as summary, DATE_FORMAT(sr.created_at, '%b %d, %Y') as date, 
                            c.name as name 
                     FROM review r
                     JOIN customer c ON r.customer_id = c.id
                     JOIN serviceRequest sr ON r.service_request_id = sr.id
                     WHERE r.shop_id = :id
                     ORDER BY sr.created_at DESC";
        $revStmt = $this->conn->prepare($revQuery);
        $revStmt->bindParam(':id', $shopId);
        $revStmt->execute();
        $details['reviews'] = $revStmt->fetchAll(PDO::FETCH_ASSOC);

        // Calculate Aggregates for Reviews
        $totalReviews = count($details['reviews']);
        $totalStars = 0;
        $recommendCount = 0;
        
        foreach($details['reviews'] as $rev) {
            $totalStars += $rev['rating'];
            if($rev['rating'] >= 4) $recommendCount++;
        }

        // 6. Calculate True Completion Rate
        $srQuery = "SELECT 
                        COUNT(id) as total_requests,
                        SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) as completed_requests
                    FROM serviceRequest 
                    WHERE shop_id = :id";
        $srStmt = $this->conn->prepare($srQuery);
        $srStmt->bindParam(':id', $shopId);
        $srStmt->execute();
        $srData = $srStmt->fetch(PDO::FETCH_ASSOC);
        
        $completionRate = 0;
        if ($srData['total_requests'] > 0) {
            $completionRate = round(($srData['completed_requests'] / $srData['total_requests']) * 100);
        }

        // 7. Handle Real-World Experience Intelligently
        $experience = "1+"; // Safe default for now
        if (isset($details['info']['established_year']) && !empty($details['info']['established_year'])) {
            $years = date('Y') - intval($details['info']['established_year']);
            $experience = $years > 0 ? $years . "+" : "1st Year";
        }

        // 8. Build the Statistics Object
        $details['stats'] = [
            'jobsCompleted' => $srData['completed_requests'] ?? 0, 
            'averageRating' => $totalReviews > 0 ? round($totalStars / $totalReviews, 1) : 0,
            'yearsExperience' => $experience, 
            'completionRate' => $completionRate . "%", 
            'reviewCount' => $totalReviews,
            'recommendPercentage' => $totalReviews > 0 ? round(($recommendCount / $totalReviews) * 100) : 0
        ];

        // 9. Get Gallery Images
        $imgQuery = "SELECT url FROM shopImage WHERE shop_id = :id";
        $imgStmt = $this->conn->prepare($imgQuery);
        $imgStmt->bindParam(':id', $shopId);
        $imgStmt->execute();
        $details['gallery'] = $imgStmt->fetchAll(PDO::FETCH_COLUMN);

        // 10. Get Shop Categories (e.g., Garages, Service Centers)
        $catQuery = "SELECT sc.name 
                     FROM shopCategoryMapping scm 
                     JOIN shopCategory sc ON scm.shop_category_id = sc.id 
                     WHERE scm.shop_id = :id";
        $catStmt = $this->conn->prepare($catQuery);
        $catStmt->bindParam(':id', $shopId);
        $catStmt->execute();
        $details['shopCategories'] = $catStmt->fetchAll(PDO::FETCH_COLUMN);

        // 11. Get Supported Vehicle Categories (e.g., 3-Wheelers, 4-Wheelers)
        $vehQuery = "SELECT vc.name 
                     FROM shopVehicleCategories svc 
                     JOIN vehicleCategory vc ON svc.vehicle_category_id = vc.id 
                     WHERE svc.shop_id = :id";
        $vehStmt = $this->conn->prepare($vehQuery);
        $vehStmt->bindParam(':id', $shopId);
        $vehStmt->execute();
        $details['vehicleCategories'] = $vehStmt->fetchAll(PDO::FETCH_COLUMN);

        return $details;
    }
}
?>