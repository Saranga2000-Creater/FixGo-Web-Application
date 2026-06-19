<?php

require_once __DIR__ . '/../models/Shop.php';

class ShopController {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    public function getProfile($shopId) {
        $shopModel = new Shop($this->db);
        $shopProfile = $shopModel->getById($shopId);

        if (!$shopProfile) {
            http_response_code(404);
            echo json_encode([
                'success' => false,
                'message' => 'Shop not found.'
            ]);
            return;
        }

        echo json_encode([
            'success' => true,
            'data' => $shopProfile
        ]);
    }

    // --- OUR NEW METHOD FOR THE SHOP DETAILS PAGE ---
    public function getDetails() {
        // 1. Only accept GET requests
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            http_response_code(405);
            echo json_encode(['success' => false, 'message' => 'Method not allowed']);
            return;
        }

        // 2. Validate that the ID exists in the URL
        if (!isset($_GET['id']) || empty($_GET['id'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Shop ID is required']);
            return;
        }

        $shopId = intval($_GET['id']);
        
        // 3. SECURE JWT AUTHENTICATION CHECK
        $customerId = null;
        
        // Get headers (works across different server environments like Apache/Nginx)
        $headers = null;
        if (isset($_SERVER['Authorization'])) {
            $headers = trim($_SERVER["Authorization"]);
        } else if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
            $headers = trim($_SERVER["HTTP_AUTHORIZATION"]);
        } elseif (function_exists('apache_request_headers')) {
            $requestHeaders = apache_request_headers();
            $requestHeaders = array_combine(array_map('ucwords', array_keys($requestHeaders)), array_values($requestHeaders));
            if (isset($requestHeaders['Authorization'])) {
                $headers = trim($requestHeaders['Authorization']);
            }
        }

        // Extract and cryptographically verify the token
        if (!empty($headers)) {
            if (preg_match('/Bearer\s(\S+)/', $headers, $matches)) {
                $jwt = $matches[1];
                
                // IMPORTANT: Adjust this path to where your JwtHandler.php is located if needed
                require_once __DIR__ . '/../config/JwtHandler.php'; 
                
                $jwtHandler = new JwtHandler();
                $payload = $jwtHandler->decode($jwt);
                
                // If decode() returns an array (not false), the signature is valid and it hasn't expired!
                if ($payload !== false) {
                    // Check if the user is specifically a customer
                    if (isset($payload['userRole']) && $payload['userRole'] === 'customer') {
                        // Extract the user ID from the JWT payload
                        if (isset($payload['id'])) {
                            $customerId = intval($payload['id']); 
                        } elseif (isset($payload['user_id'])) {
                            $customerId = intval($payload['user_id']); // Fallback just in case
                        }
                    }
                }
            }
        }

        // 4. Instantiate the model using your existing DB connection
        $shopModel = new Shop($this->db);

        // 5. Pass BOTH the shopId and the extracted customerId to the model
        $shopData = $shopModel->getShopDetails($shopId, $customerId);

        // 5. Return the JSON payload
        if ($shopData) {
            http_response_code(200);
            echo json_encode([
                'success' => true,
                'data' => $shopData
            ]);
        } else {
            http_response_code(404);
            echo json_encode([
                'success' => false,
                'message' => 'Shop not found or is no longer active'
            ]);
        }
    }
}