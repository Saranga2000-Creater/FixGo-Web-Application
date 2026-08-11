<?php

class PlatformReview {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    public function submitReview($userId, $rating, $comment) {
        $stmt = $this->db->prepare(
            "INSERT INTO platform_reviews (user_id, rating, comment, created_at) VALUES (:user_id, :rating, :comment, NOW())"
        );
        return $stmt->execute([
            ':user_id' => $userId,
            ':rating'  => $rating,
            ':comment' => $comment
        ]);
    }

    public function getReviews() {
        $query = "
            SELECT 
                pr.id,
                pr.rating AS stars,
                pr.comment AS text,
                pr.created_at,
                u.userRole,
                c.name AS customerName,
                c.profilePhoto AS customerPhoto,
                c.address AS customerAddress,
                s.owner AS shopOwnerName,
                s.name AS shopName,
                s.profileImageURL AS shopPhoto,
                s.address AS shopAddress
            FROM platform_reviews pr
            JOIN users u ON u.id = pr.user_id
            LEFT JOIN customer c ON c.id = u.id AND u.userRole = 'customer'
            LEFT JOIN shop s ON s.id = u.id AND u.userRole = 'shop_owner'
            ORDER BY pr.rating DESC, pr.created_at DESC
            LIMIT 15
        ";

        $stmt = $this->db->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
