<?php
class Shop {
    private $conn;
    private $table_name = 'shop'; 

    public function __construct($db) {
        $this->conn = $db;
    }

    // CHANGED: Added $searchName = null to the end of the parameters
    public function findNearby($lat, $lng, $radiusInKm, $vehicleCategoryId = null, $shopCategoryId = null, $sortBy = 'distance', $searchName = null, $needs_tow = 'false', $quickFilter = 'all', $currentTime = null) {
        $radiusInMeters = $radiusInKm * 1000;

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
                    -- 2. ADDED: Dynamically count all completed requests for this shop!
                    (SELECT COUNT(*) FROM serviceRequest sr WHERE sr.shop_id = s.id AND sr.status = 'Completed') as services_completed,
                    -- Calculate actual average response time in minutes
                    -- If they have no accepted requests yet, it defaults to 15
                    (SELECT COALESCE(ROUND(AVG(TIMESTAMPDIFF(MINUTE, sr.created_at, sr.accepted_at))), 15) 
                     FROM serviceRequest sr 
                     WHERE sr.shop_id = s.id AND sr.accepted_at IS NOT NULL) as response_time_minutes,
                    GROUP_CONCAT(DISTINCT sc.name SEPARATOR ', ') as shop_tags,
                    -- CHANGED: Added extraction of vehicle category names for the UI tags
                    GROUP_CONCAT(DISTINCT vc.name SEPARATOR ', ') as vehicle_tags
                  FROM " . $this->table_name . " s
                  LEFT JOIN review r ON s.id = r.shop_id
                  LEFT JOIN shopCategoryMapping scm ON s.id = scm.shop_id
                  LEFT JOIN shopCategory sc ON scm.shop_category_id = sc.id
                  -- CHANGED: Added LEFT JOINs to fetch all vehicle categories assigned to this shop
                  LEFT JOIN shopVehicleCategories svc_all ON s.id = svc_all.shop_id
                  LEFT JOIN vehicleCategory vc ON svc_all.vehicle_category_id = vc.id";

        // Filter Logic: We use separate aliases (svc_filter) so the filter doesn't break the tag extraction above
        if ($vehicleCategoryId !== null) {
            $query .= " INNER JOIN shopVehicleCategories svc_filter ON s.id = svc_filter.shop_id ";
        }

        $query .= " WHERE ST_Distance_Sphere(s.location, POINT(:lng, :lat)) <= :radius ";

        if ($needs_tow === 'true') {
            $query .= " AND s.has_tow_service = 1 ";
        }

        if ($vehicleCategoryId !== null) {
            $query .= " AND svc_filter.vehicle_category_id = :vehicle_category ";
        }
        if ($shopCategoryId !== null) {
            $query .= " AND scm.shop_category_id = :shop_category ";
        }
        // 3. ADDED: Dynamically inject the LIKE clause if a name was typed
        if ($searchName !== null && $searchName !== '') {
            $query .= " AND s.name LIKE :searchName ";
        }

        // 3. ADDED: Quick Filter Logic (Open Now & Roadside)
        if ($quickFilter === 'open') {
            $query .= " AND s.isAvailable = 1 AND :currentTime BETWEEN s.openTime AND s.closeTime ";
        } elseif ($quickFilter === 'roadside') {
            $query .= " AND s.has_tow_service = 1 ";
        }

        $query .= " GROUP BY s.id ";

        // 4. ADDED: Quick Filter Logic (Top Rated - Needs HAVING since it's an aggregate)
        if ($quickFilter === 'top_rated') {
            $query .= " HAVING avg_rating >= 4.0 ";
        }

        // 5. ADDED: Quick Filter Logic (Nearest Sorting override)
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

        // 4. ADDED: Safely bind the search string with SQL wildcards (%)
        if ($searchName !== null && $searchName !== '') {
            $searchTerm = '%' . $searchName . '%';
            $stmt->bindParam(':searchName', $searchTerm, PDO::PARAM_STR);
        }

        // 6. ADDED: Bind the current time for the 'Open Now' filter
        if ($quickFilter === 'open') {
            $stmt->bindParam(':currentTime', $currentTime, PDO::PARAM_STR);
        }

        $stmt->execute();
        return $stmt;
    }
}
?>