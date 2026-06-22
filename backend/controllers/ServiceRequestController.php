<?php
class ServiceRequestController {
    private $serviceRequestModel;
    private $jwtHandler;
    private $db;

    public function __construct($db) {
        $this->db = $db;
        require_once __DIR__ . '/../models/ServiceRequest.php';
        require_once __DIR__ . '/../config/JwtHandler.php';

        $this->serviceRequestModel = new ServiceRequest($db);
        $this->jwtHandler          = new JwtHandler();
    }

    public function handleCreateRequest($requestData, $headers) {
        $authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : '';
        $token = null;

        if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            $token = $matches[1];
        }

        if (
            empty($requestData['shop_id']) ||
            empty($requestData['customer_id']) ||
            empty($requestData['vehicle_category_id'])
        ) {
            http_response_code(400);
            return json_encode(["message" => "Incomplete data. Shop ID, Customer ID, and Vehicle Category are required."]);
        }

        if (
            $this->serviceRequestModel->hasPendingRequest(
                $requestData['customer_id'],
                $requestData['shop_id']
            )
        ) {
            http_response_code(429);
            return json_encode([
                "message" => "You already have a pending request for this shop."
            ]);
        }

        $photoPath = null;
        if (!empty($requestData['problem_image'])) {
            $base64Str = $requestData['problem_image'];

            if (preg_match('/^data:image\/(\w+);base64,/', $base64Str, $type)) {
                $base64Data    = substr($base64Str, strpos($base64Str, ',') + 1);
                $fileExtension = strtolower($type[1]);

                if (in_array($fileExtension, ['jpg', 'jpeg', 'png'])) {
                    $decodedImage = base64_decode($base64Data);

                    if ($decodedImage !== false) {
                        $fileName  = uniqid('req_') . '.' . $fileExtension;
                        $uploadDir = __DIR__ . '/../uploads/serviceRequests/';
                        if (!file_exists($uploadDir)) {
                            mkdir($uploadDir, 0777, true);
                        }

                        $absolutePath = $uploadDir . $fileName;
                        file_put_contents($absolutePath, $decodedImage);
                        $photoPath = 'uploads/serviceRequests/' . $fileName;
                    }
                }
            }
        }

        $requestData['photo'] = $photoPath;

        $insertId = $this->serviceRequestModel->create($requestData);

        if ($insertId) {
            http_response_code(201);
            return json_encode([
                "message"    => "Service request created successfully.",
                "request_id" => $insertId
            ]);
        } else {
            http_response_code(503);
            return json_encode(["message" => "Unable to create service request."]);
        }
    }

    public function handleUpdateStatus($requestData, $headers) {
        $authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : '';
        $token = null;
        if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            $token = $matches[1];
        }

        // DUMMY DATA FOR TESTING (Remove when JWT is active)
        $actor_id   = $requestData['actor_id'];
        $actor_role = $requestData['actor_role'];

        if (empty($requestData['request_id']) || empty($requestData['new_status'])) {
            http_response_code(400);
            return json_encode(["message" => "Request ID and New Status are required."]);
        }

        $request_id = $requestData['request_id'];
        $new_status = $requestData['new_status'];

        $currentRequest = $this->serviceRequestModel->getById($request_id);
        if (!$currentRequest) {
            http_response_code(404);
            return json_encode(["message" => "Service request not found."]);
        }

        $current_status = $currentRequest['status'];

        if ($actor_role === 'customer' && $currentRequest['customer_id'] != $actor_id) {
            http_response_code(403);
            return json_encode(["message" => "Forbidden: You do not own this request."]);
        }
        if ($actor_role === 'shop_owner' && $currentRequest['shop_id'] != $actor_id) {
            http_response_code(403);
            return json_encode(["message" => "Forbidden: This request does not belong to your shop."]);
        }

        // --- CUSTOMER RULES ---
        if ($actor_role === 'customer') {

            if ($new_status === 'Confirmed') {
                if ($current_status !== 'Accepted') {
                    http_response_code(400);
                    return json_encode(["message" => "Illegal Move: You can only confirm an 'Accepted' request."]);
                }

                $this->serviceRequestModel->updateStatus($request_id, 'Confirmed');
                $this->serviceRequestModel->cancelCompetingRequests($actor_id, $request_id);

                http_response_code(200);
                return json_encode(["message" => "Handshake Confirmed! Shop details unlocked."]);
            }

            elseif ($new_status === 'Cancelled') {
                $reason = rtrim($requestData['reason'] ?? "Customer cancelled the request.");

                if (in_array($current_status, ['Confirmed', 'In Progress', 'Diagnosis', 'Pending Parts'])) {
                    require_once __DIR__ . '/../models/Customer.php';
                    $customerModel = new Customer($this->db);
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

            if ($new_status === 'Confirmed') {
                http_response_code(403);
                return json_encode(["message" => "Shops cannot force a confirmation. Only customers can confirm."]);
            }

            if ($new_status === 'Accepted') {
                if ($current_status !== 'Pending') {
                    http_response_code(400);
                    return json_encode(["message" => "You can only accept 'Pending' requests."]);
                }

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

            elseif (in_array($new_status, ['Diagnosis', 'Pending Parts', 'In Progress', 'Completed'])) {

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

        foreach ($requests as &$req) {
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

        foreach ($requests as &$req) {
            $safeStatus = strtolower(trim($req['status']));
            if (in_array($safeStatus, ['pending', 'accepted', 'cancelled', 'canceled'])) {
                $req['customer_phone'] = 'Locked until Confirmed';
            }
        }

        http_response_code(200);
        return json_encode(["success" => true, "data" => $requests]);
    }

    public function handleGetConfirmedRequests($shop_id)
    {
        $requests = $this->serviceRequestModel->getConfirmedRequestsByShop($shop_id);

        http_response_code(200);
        return json_encode([
            "success" => true,
            "data"    => $requests
        ]);
    }

    public function handleGetActiveRepairs($shop_id)
    {
        $repairs = $this->serviceRequestModel->getActiveRepairsByShop($shop_id);

        http_response_code(200);
        return json_encode([
            "success" => true,
            "data"    => $repairs
        ]);
    }

    public function handleGetServiceHistory($shop_id)
    {
        $history = $this->serviceRequestModel->getServiceHistoryByShop($shop_id);

        http_response_code(200);
        return json_encode([
            "success" => true,
            "data"    => $history
        ]);
    }

    // ==========================================
    // CUSTOMER-SIDE HISTORY
    // ==========================================

    public function handleGetCustomerServiceHistory($customer_id)
    {
        $history = $this->serviceRequestModel->getServiceHistoryByCustomer($customer_id);

        http_response_code(200);
        return json_encode([
            "success" => true,
            "data"    => $history
        ]);
    }

}
?>