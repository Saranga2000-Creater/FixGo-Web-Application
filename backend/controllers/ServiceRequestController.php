<?php
class ServiceRequestController {
    private $serviceRequestModel;
    private $jwtHandler;

    public function __construct($db) {
        require_once __DIR__ . '/../models/ServiceRequest.php';
        // 1. Include your existing JWT Handler
        require_once __DIR__ . '/../config/JwtHandler.php'; 
        
        $this->serviceRequestModel = new ServiceRequest($db);
        $this->jwtHandler = new JwtHandler();
    }

    public function handleCreateRequest($requestData, $headers) {
        // 2. Extract the Authorization Header
        $authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : '';
        $token = null;

        if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            $token = $matches[1];
        }

        // 3. Verify the Token BEFORE doing anything else
        if (!$token || !$this->jwtHandler->decode($token)) {
            http_response_code(401);
            return json_encode(["message" => "Unauthorized access. Valid token is required."]);
        }

        // 4. If the token is valid, proceed with your existing validation
        if (
            empty($requestData['shop_id']) ||
            empty($requestData['customer_id']) ||
            empty($requestData['vehicle_category_id'])
        ) {
            http_response_code(400);
            return json_encode(["message" => "Incomplete data. Shop ID, Customer ID, and Vehicle Category are required."]);
        }

        // 4. Validate required fields
        if (
            empty($requestData['shop_id']) ||
            empty($requestData['customer_id']) ||
            empty($requestData['vehicle_category_id'])
        ) {
            http_response_code(400);
            return json_encode(["message" => "Incomplete data. Shop ID, Customer ID, and Vehicle Category are required."]);
        }

        // ADDED: 5. Prevent Duplicate/Spam Requests
        if ($this->serviceRequestModel->hasPendingRequest($requestData['customer_id'])) {
            http_response_code(429); // 429 means "Too Many Requests" (or 409 Conflict)
            return json_encode(["message" => "You already have a pending tow truck request. Please wait for the shop to respond."]);
        }

        // 6. Execute the creation
        $insertId = $this->serviceRequestModel->create($requestData);

        if ($insertId) {
            http_response_code(201);
            return json_encode([
                "message" => "Service request created successfully.",
                "request_id" => $insertId
            ]);
        } else {
            http_response_code(503);
            return json_encode(["message" => "Unable to create service request."]);
        }
    }
}
?>