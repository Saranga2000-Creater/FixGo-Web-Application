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

    public function handleUpdateStatus($requestData, $headers) {
        // 1. JWT Authentication (Assuming JWT handler extracts user_id and role)
        $authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : '';
        $token = null;
        if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            $token = $matches[1];
        }

        /* // UNCOMMENT THIS IN PRODUCTION TO ENFORCE LOGIN
        $decoded = $this->jwtHandler->decode($token);
        if (!$token || !$decoded) {
            http_response_code(401);
            return json_encode(["message" => "Unauthorized access."]);
        }
        $actor_id = $decoded->data->id;
        $actor_role = $decoded->data->userRole; // 'customer' or 'shop_owner'
        */

        // DUMMY DATA FOR TESTING (Remove when JWT is active)
        $actor_id = $requestData['actor_id']; 
        $actor_role = $requestData['actor_role'];

        // 2. Validate Payload
        if (empty($requestData['request_id']) || empty($requestData['new_status'])) {
            http_response_code(400);
            return json_encode(["message" => "Request ID and New Status are required."]);
        }

        $request_id = $requestData['request_id'];
        $new_status = $requestData['new_status'];

        // 3. Fetch Current State from Database
        $currentRequest = $this->serviceRequestModel->getById($request_id);
        if (!$currentRequest) {
            http_response_code(404);
            return json_encode(["message" => "Service request not found."]);
        }

        $current_status = $currentRequest['status'];

        // 4. OWNERSHIP SECURITY CHECK
        if ($actor_role === 'customer' && $currentRequest['customer_id'] != $actor_id) {
            http_response_code(403);
            return json_encode(["message" => "Forbidden: You do not own this request."]);
        }
        if ($actor_role === 'shop_owner' && $currentRequest['shop_id'] != $actor_id) {
            http_response_code(403);
            return json_encode(["message" => "Forbidden: This request does not belong to your shop."]);
        }

        // ==========================================
        // 5. THE STATE MACHINE (THE GAUNTLET)
        // ==========================================

        // --- CUSTOMER RULES ---
        if ($actor_role === 'customer') {
            
            if ($new_status === 'Confirmed') {
                if ($current_status !== 'Accepted') {
                    http_response_code(400);
                    return json_encode(["message" => "Illegal Move: You can only confirm an 'Accepted' request."]);
                }
                
                // Success: Confirm the request & Kill competitors
                $this->serviceRequestModel->updateStatus($request_id, 'Confirmed');
                $this->serviceRequestModel->cancelCompetingRequests($actor_id, $request_id);
                
                http_response_code(200);
                return json_encode(["message" => "Handshake Confirmed! Shop details unlocked."]);
            } 
            
            elseif ($new_status === 'Cancelled') {
                $reason = rtrim($requestData['reason'] ?? "Customer cancelled the request.");
                
                // PENALTY CHECK: Did they cancel AFTER the handshake?
                if (in_array($current_status, ['Confirmed', 'In Progress', 'Diagnosis', 'Pending Parts'])) {
                    // Inject dependency model here to avoid cluttering constructor
                    require_once __DIR__ . '/../models/Customer.php';
                    $customerModel = new Customer($this->serviceRequestModel->conn);
                    $customerModel->incrementCancellationStrikes($actor_id);
                    $penaltyMsg = " Note: A cancellation strike has been applied to your account.";
                } else {
                    $penaltyMsg = "";
                }

                $this->serviceRequestModel->cancelRequest($request_id, 'Customer', $reason);
                http_response_code(200);
                return json_encode(["message" => "Request cancelled." . $penaltyMsg]);
            }
            
            else {
                http_response_code(403);
                return json_encode(["message" => "Customers cannot manually set status to '$new_status'."]);
            }
        }

        // --- SHOP OWNER RULES ---
        if ($actor_role === 'shop_owner') {
            
            // Cannot bypass the customer's lock
            if ($new_status === 'Confirmed') {
                http_response_code(403);
                return json_encode(["message" => "Shops cannot force a confirmation. Only customers can confirm."]);
            }

            if ($new_status === 'Accepted') {
                if ($current_status !== 'Pending') {
                    http_response_code(400);
                    return json_encode(["message" => "You can only accept 'Pending' requests."]);
                }

                // If Tow Truck Details were sent in the payload, save them
                if (isset($requestData['promised_eta'])) {
                    $this->serviceRequestModel->updateTowDetails(
                        $request_id,
                        $requestData['promised_eta'],
                        $requestData['dispatched_truck_brand'] ?? null,
                        $requestData['dispatched_truck_color'] ?? null,
                        $requestData['dispatched_truck_plate'] ?? null,
                        $requestData['dispatched_driver_name'] ?? null,
                        $requestData['dispatched_driver_phone'] ?? null
                    );
                }

                $this->serviceRequestModel->updateStatus($request_id, 'Accepted');
                http_response_code(200);
                return json_encode(["message" => "Request Accepted. Waiting for customer confirmation."]);
            }

            elseif ($new_status === 'Cancelled' || $new_status === 'Declined') {
                $reason = $requestData['reason'] ?? "Shop declined/cancelled the request.";
                $this->serviceRequestModel->cancelRequest($request_id, 'Shop', $reason);
                http_response_code(200);
                return json_encode(["message" => "Request successfully cancelled."]);
            }

            // POST-CONFIRMATION MILESTONES (Diagnosis, Pending Parts, In Progress, Completed)
            elseif (in_array($new_status, ['Diagnosis', 'Pending Parts', 'In Progress', 'Completed'])) {
                
                // Ensure the handshake was actually completed before allowing these updates
                if (in_array($current_status, ['Pending', 'Accepted', 'Cancelled'])) {
                    http_response_code(400);
                    return json_encode(["message" => "Cannot update repair milestones until the customer Confirms the request."]);
                }

                $this->serviceRequestModel->updateStatus($request_id, $new_status);
                http_response_code(200);
                return json_encode(["message" => "Repair milestone updated to: $new_status."]);
            }

            else {
                http_response_code(400);
                return json_encode(["message" => "Invalid status update requested."]);
            }
        }

        http_response_code(400);
        return json_encode(["message" => "Invalid user role."]);
    }

    // ==========================================
    // DASHBOARD RETRIEVAL & PRIVACY MASKING
    // ==========================================

    public function handleGetCustomerRequests($customer_id) {
        $requests = $this->serviceRequestModel->getRequestsByCustomer($customer_id);
        
        // Apply the Privacy Mask for the Customer
        foreach ($requests as &$req) { // The '&' is CRITICAL to modify the array!
            // Bulletproof: Trim invisible spaces and force lowercase
            $safeStatus = strtolower(trim($req['status']));
            
            if (in_array($safeStatus, ['pending', 'accepted', 'cancelled', 'canceled'])) {
                $req['shop_phone'] = 'Locked until Confirmed';
            }
        }
        
        http_response_code(200);
        return json_encode(["success" => true, "data" => $requests]);
    }

    public function handleGetShopRequests($shop_id) {
        $requests = $this->serviceRequestModel->getRequestsByShop($shop_id);
        
        // Apply the Privacy Mask for the Shop
        foreach ($requests as &$req) { // The '&' is CRITICAL!
            // Bulletproof: Trim invisible spaces and force lowercase
            $safeStatus = strtolower(trim($req['status']));
            
            if (in_array($safeStatus, ['pending', 'accepted', 'cancelled', 'canceled'])) {
                $req['customer_phone'] = 'Locked until Confirmed';
            }
        }
        
        http_response_code(200);
        return json_encode(["success" => true, "data" => $requests]);
    }
}
?>