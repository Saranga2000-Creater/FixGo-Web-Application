<?php

require_once __DIR__ . '/../models/Review.php';

class ReviewController {
    private $review;

    public function __construct($db) {
        $this->review = new Review($db);
    }

    private function getUserIdFromToken() {
        $headers = getallheaders();
        $auth = $headers['Authorization'] ?? $headers['authorization'] ?? '';
        if (!preg_match('/Bearer\s(\S+)/', $auth, $m)) return null;
        $parts = explode('.', $m[1]);
        if (count($parts) < 2) return null;
        $payload = json_decode(base64_decode(strtr($parts[1], '-_', '+/')), true);
        return $payload['user_id'] ?? $payload['id'] ?? null;
    }

    public function submit() {
        $customerId = $this->getUserIdFromToken();
        if (!$customerId) {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Unauthorized']);
            return;
        }

        $input = json_decode(file_get_contents('php://input'), true);
        $serviceRequestId = $input['service_request_id'] ?? null;
        $shopId           = $input['shop_id'] ?? null;
        $rating           = (int)($input['rating'] ?? 0);
        $comment          = trim($input['comment'] ?? '');

        if (!$serviceRequestId || !$shopId || !$rating) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Missing required fields']);
            return;
        }
        if ($rating < 1 || $rating > 5) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Rating must be between 1 and 5']);
            return;
        }
        if (strlen($comment) > 255) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Comment must be 255 characters or fewer']);
            return;
        }

        try {
            $request = $this->review->getServiceRequest($serviceRequestId);

            if (!$request || $request['customer_id'] != $customerId) {
                http_response_code(403);
                echo json_encode(['success' => false, 'message' => 'Not authorized to review this request']);
                return;
            }
            if ($request['shop_id'] != $shopId) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Shop does not match this service request']);
                return;
            }
            if ($request['status'] !== 'Completed') {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'You can only review completed services']);
                return;
            }
            if ($this->review->findDuplicate($serviceRequestId, $customerId)) {
                http_response_code(409);
                echo json_encode(['success' => false, 'message' => 'You already reviewed this service']);
                return;
            }

            $reviewId = $this->review->create($customerId, $shopId, $serviceRequestId, $rating, $comment);

            echo json_encode(['success' => true, 'message' => 'Review submitted', 'review_id' => $reviewId]);

        } catch (PDOException $e) {
            if ($e->getCode() == 23000) {
                http_response_code(409);
                echo json_encode(['success' => false, 'message' => 'You already reviewed this service']);
                return;
            }
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Database error', 'error' => $e->getMessage()]);
        }
    }

    public function getCustomerReviews() {
        $customerId = $this->getUserIdFromToken();
        if (!$customerId) {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Unauthorized']);
            return;
        }

        try {
            $reviews = $this->review->getByCustomer($customerId);
            echo json_encode(['success' => true, 'data' => $reviews]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Database error', 'error' => $e->getMessage()]);
        }
    }

    public function getShopReviews() {
        $shopId = $_GET['shop_id'] ?? null;
        if (!$shopId) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'shop_id is required']);
            return;
        }

        try {
            $reviews = $this->review->getByShop($shopId);
            $summary = $this->review->getShopAverage($shopId);

            echo json_encode([
                'success' => true,
                'average_rating' => $summary['average_rating'] ? (float)$summary['average_rating'] : 0,
                'total_reviews' => (int)$summary['total_reviews'],
                'data' => $reviews
            ]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Database error', 'error' => $e->getMessage()]);
        }
    }
}