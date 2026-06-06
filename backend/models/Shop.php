<?php
class Shop {
    private $conn;
    private $table_name = 'shop'; 

    public function __construct($db) {
        $this->conn = $db;
    }

    public function findNearby($lat, $lng, $radiusInKm, $vehicleCategoryId = null, $shopCategoryId = null, $sortBy = 'distance') {
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

        if ($vehicleCategoryId !== null) {
            $query .= " AND svc_filter.vehicle_category_id = :vehicle_category ";
        }
        if ($shopCategoryId !== null) {
            $query .= " AND scm.shop_category_id = :shop_category ";
        }

        $query .= " GROUP BY s.id ";

        if ($sortBy === 'rating') {
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

        $stmt->execute();
        return $stmt;
    }
}
?>