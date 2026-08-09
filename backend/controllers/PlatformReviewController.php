<?php

class PlatformReviewController {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    /**
     * Submit a platform review (logged-in users only)
     */
    public function submitReview($userId, $data) {
        if (!is_object($data) && !is_array($data)) {
            $data = json_decode(file_get_contents("php://input"));
        }

        $rating = isset($data->rating) ? intval($data->rating) : 0;
        $comment = isset($data->comment) ? trim($data->comment) : '';

        if ($rating < 1 || $rating > 5) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Rating must be between 1 and 5 stars."]);
            return;
        }

        if (empty($comment)) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Review comment cannot be empty."]);
            return;
        }

        try {
            $stmt = $this->db->prepare(
                "INSERT INTO platform_reviews (user_id, rating, comment, created_at) VALUES (:user_id, :rating, :comment, NOW())"
            );
            $stmt->execute([
                ':user_id' => $userId,
                ':rating'  => $rating,
                ':comment' => $comment
            ]);

            http_response_code(201);
            echo json_encode([
                "success" => true,
                "message" => "Thank you for your review!"
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Failed to submit review: " . $e->getMessage()]);
        }
    }

    /**
     * Extract hometown from address (last word/segment after last comma)
     */
    private function extractHometown($address) {
        if (empty($address)) {
            return "Sri Lanka";
        }
        $parts = explode(',', $address);
        $lastPart = trim(end($parts));
        return !empty($lastPart) ? $lastPart : "Sri Lanka";
    }

    /**
     * Retrieve top & recent platform reviews for homepage/support page carousel
     */
    public function getReviews() {
        try {
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
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $reviews = [];
            foreach ($rows as $row) {
                $name = "Anonymous User";
                $avatar = null;
                $address = "";

                if ($row['userRole'] === 'customer') {
                    $name = $row['customerName'] ?: "FixGo User";
                    $avatar = $row['customerPhoto'];
                    $address = $row['customerAddress'];
                } else if ($row['userRole'] === 'shop_owner') {
                    $name = $row['shopOwnerName'] ?: ($row['shopName'] ?: "Shop Owner");
                    $avatar = $row['shopPhoto'];
                    $address = $row['shopAddress'];
                }

                $hometown = $this->extractHometown($address);

                $reviews[] = [
                    "id"       => intval($row['id']),
                    "name"     => $name,
                    "location" => $hometown,
                    "stars"    => intval($row['stars']),
                    "text"     => $row['text'],
                    "avatar"   => $avatar,
                    "date"     => $row['created_at']
                ];
            }

            http_response_code(200);
            echo json_encode([
                "success" => true,
                "data"    => $reviews
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Failed to fetch reviews: " . $e->getMessage()]);
        }
    }
}
