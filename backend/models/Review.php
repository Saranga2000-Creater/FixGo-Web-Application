<?php

class Review {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    public function getServiceRequest($serviceRequestId) {
        $stmt = $this->db->prepare("SELECT status, customer_id, shop_id FROM servicerequest WHERE id = ?");
        $stmt->execute([$serviceRequestId]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function findDuplicate($serviceRequestId, $customerId) {
        $stmt = $this->db->prepare("SELECT id FROM review WHERE service_request_id = ? AND customer_id = ?");
        $stmt->execute([$serviceRequestId, $customerId]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function create($customerId, $shopId, $serviceRequestId, $rating, $comment) {
        $stmt = $this->db->prepare(
            "INSERT INTO review (customer_id, shop_id, service_request_id, rating, comment, created_at)
             VALUES (?, ?, ?, ?, ?, NOW())"
        );
        $stmt->execute([$customerId, $shopId, $serviceRequestId, $rating, $comment]);
        return $this->db->lastInsertId();
    }

    public function getByCustomer($customerId) {
    $stmt = $this->db->prepare("
        SELECT r.id, r.service_request_id, r.rating, r.comment, r.created_at,
               s.name AS shop_name,
               sr.vehicle_brand, sr.issue_category
        FROM review r
        JOIN shop s ON s.id = r.shop_id
        LEFT JOIN servicerequest sr ON sr.id = r.service_request_id
        WHERE r.customer_id = ?
        ORDER BY r.created_at DESC
    ");
    $stmt->execute([$customerId]);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}
    public function getByShop($shopId) {
        $stmt = $this->db->prepare("
            SELECT r.id, r.rating, r.comment, r.created_at,
                   c.name AS customer_name
            FROM review r
            JOIN customer c ON c.id = r.customer_id
            WHERE r.shop_id = ?
            ORDER BY r.created_at DESC
        ");
        $stmt->execute([$shopId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getShopAverage($shopId) {
        $stmt = $this->db->prepare("
            SELECT ROUND(AVG(rating), 1) AS average_rating, COUNT(*) AS total_reviews
            FROM review
            WHERE shop_id = ?
        ");
        $stmt->execute([$shopId]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}