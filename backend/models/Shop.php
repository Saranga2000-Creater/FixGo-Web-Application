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
        // Includes carriageService, BRN, and the main profile image logic
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
                si.url AS profileImageURL,
                GROUP_CONCAT(DISTINCT sc.name SEPARATOR ', ') AS categories
            FROM users u
            INNER JOIN shop s ON u.id = s.id
            LEFT JOIN shopImage si ON si.shop_id = s.id AND si.is_main = 1
            LEFT JOIN shopCategoryMapping scm ON scm.shop_id = s.id
            LEFT JOIN shopCategory sc ON sc.id = scm.shop_category_id
            WHERE u.id = :id
            GROUP BY s.id
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
                    ST_Y(s.location) as latitude, 
                    ST_X(s.location) as longitude,
                    ST_Distance_Sphere(s.location, POINT(:lng, :lat)) AS distance,
                    (SELECT url FROM shopImage WHERE shop_id = s.id LIMIT 1) as thumbnail_url,
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
}
?>