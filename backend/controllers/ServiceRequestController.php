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

        // // 3. Verify the Token BEFORE doing anything else
        // if (!$token || !$this->jwtHandler->decode($token)) {
        //     http_response_code(401);
        //     return json_encode(["message" => "Unauthorized access. Valid token is required."]);
        // }

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

        // 5.5 Handle the Optional Image Upload
        $photoPath = null;
        if (!empty($requestData['problem_image'])) {
            $base64Str = $requestData['problem_image'];
            
            // Extract the file type and the actual base64 data
            if (preg_match('/^data:image\/(\w+);base64,/', $base64Str, $type)) {
                $base64Data = substr($base64Str, strpos($base64Str, ',') + 1);
                $fileExtension = strtolower($type[1]); // e.g., png, jpg, jpeg

                // Only allow specific image types for security
                if (in_array($fileExtension, ['jpg', 'jpeg', 'png'])) {
                    $decodedImage = base64_decode($base64Data);
                    
                    if ($decodedImage !== false) {
                        // Generate a unique filename
                        $fileName = uniqid('req_') . '.' . $fileExtension;
                        
                        // Define where to save it (Creates an 'uploads' folder in your backend root)
                        $uploadDir = __DIR__ . '/../uploads/serviceRequests/';
                        if (!file_exists($uploadDir)) {
                            mkdir($uploadDir, 0777, true);
                        }
                        
                        $absolutePath = $uploadDir . $fileName;
                        
                        // Save the physical file to the server
                        file_put_contents($absolutePath, $decodedImage);
                        
                        // Save the relative path for the database
                        $photoPath = 'uploads/serviceRequests/' . $fileName;
                    }
                }
            }
        }
        
        // Add the photo path to our data array before sending to the model
        $requestData['photo'] = $photoPath;

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