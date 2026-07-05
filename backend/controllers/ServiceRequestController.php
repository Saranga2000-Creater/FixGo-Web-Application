<?php
class ServiceRequestController {
    private $serviceRequestModel;
    private $shopModel;
    private $jwtHandler;
    private $db;

    public function __construct($db) {
        $this->db = $db;
        require_once __DIR__ . '/../models/ServiceRequest.php';
        require_once __DIR__ . '/../models/Shop.php';
        require_once __DIR__ . '/../config/JwtHandler.php';

        $this->serviceRequestModel = new ServiceRequest($db);
        $this->shopModel           = new Shop($db);
        $this->jwtHandler          = new JwtHandler();
    }

    // ==========================================
    // NOTIFICATION HELPER
    // ==========================================
    // Inserts a row into `notification`. Message is left NULL on purpose —
    // Notification.jsx derives the live message text from the joined
    // servicerequest/shop data (shop name, tow details, etc.) so it never
    // goes stale. `type` already stores the status value at creation time
    // (e.g. 'Accepted', 'In Progress', 'Completed'), so getNotifications.php
    // selects it as `status` — no separate status column needed.
    // Failure here should never break the main status-update flow.
    private function notifyCustomer($userId, $requestId, $type, $title) {
        try {
            $stmt = $this->db->prepare(
                "INSERT INTO notification (user_id, service_request_id, type, title, message, isRead)
                 VALUES (:user_id, :request_id, :type, :title, NULL, 0)"
            );
            $stmt->execute([
                'user_id'    => $userId,
                'request_id' => $requestId,
                'type'       => $type,
                'title'      => $title,
            ]);
        } catch (Throwable $e) {
            error_log("notifyCustomer failed: " . $e->getMessage());
        }
    }

    public function handleCreateRequest($requestData, $payload)
{
    $requestData['customer_id'] = $payload['user_id'];

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

    public function handleUpdateStatus($requestData, $payload)
{
    $actor_id = $payload['user_id'] ?? null;
    $actor_role = $payload['role'] ?? null;

    if (!$actor_id || !$actor_role) {
        http_response_code(401);
        return json_encode([
            "message" => "Unauthorized."
        ]);
    }

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
        $customer_id    = $currentRequest['customer_id'];

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


                $this->serviceRequestModel->updateStatus($request_id, 'Accepted');

                $this->notifyCustomer($customer_id, $request_id, 'Accepted', 'Request accepted');

                http_response_code(200);
                return json_encode(["message" => "Request Accepted. Waiting for customer confirmation."]);
            }

          elseif ($new_status === 'Declined') {
    $reason = $requestData['reason'] ?? "Shop declined the request.";
    $this->serviceRequestModel->declineRequest($request_id, $reason);

    $this->notifyCustomer($customer_id, $request_id, 'Declined', 'Request declined');

    http_response_code(200);
    return json_encode(["message" => "Request successfully declined."]);
}

elseif ($new_status === 'Cancelled') {
    $reason = $requestData['reason'] ?? "Shop cancelled the request.";
    $this->serviceRequestModel->cancelRequest($request_id, 'Shop', $reason);

    $this->notifyCustomer($customer_id, $request_id, 'Cancelled', 'Booking cancelled by shop');

    http_response_code(200);
    return json_encode(["message" => "Request successfully cancelled."]);
} 

            elseif (in_array($new_status, ['Diagnosis', 'Pending Parts', 'In Progress', 'Completed'])) {

                if (in_array($current_status, ['Pending', 'Accepted', 'Cancelled'])) {
                    http_response_code(400);
                    return json_encode(["message" => "Cannot update repair milestones until the customer Confirms the request."]);
                }

                $this->serviceRequestModel->updateStatus($request_id, $new_status);

                $this->notifyCustomer($customer_id, $request_id, $new_status, "Repair status: $new_status");

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
public function handleGetCustomerRequests($payload)
{
    $customer_id = $payload['user_id'];
        $this->serviceRequestModel->cancelStaleRequests();
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

 public function handleGetShopRequests($payload)
{
    $shop_id = $payload['user_id'];   
        $this->serviceRequestModel->cancelStaleRequests();
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

public function handleGetDeclinedRequests($payload)
{
    $shop_id = $payload['user_id'];
    $requests = $this->serviceRequestModel->getDeclinedRequestsByShop($shop_id);

    http_response_code(200);
    return json_encode([
        "success" => true,
        "data"    => $requests
    ]);
}

    
 public function handleGetConfirmedRequests($payload)
{
    $shop_id = $payload['user_id'];   
        $requests = $this->serviceRequestModel->getConfirmedRequestsByShop($shop_id);

        http_response_code(200);
        return json_encode([
            "success" => true,
            "data"    => $requests
        ]);
    }

    public function handleGetActiveRepairs($payload)
{
    $shop_id = $payload['user_id'];
    $repairs = $this->serviceRequestModel->getActiveRepairsByShop($shop_id);

    http_response_code(200);

    return json_encode([
        "success" => true,
        "data" => $repairs
    ]);
}

    public function handleGetServiceHistory($payload)
{
    $shop_id = $payload['user_id'];
        $history = $this->serviceRequestModel->getServiceHistoryByShop($shop_id);

        http_response_code(200);
        return json_encode([
            "success" => true,
            "data"    => $history
        ]);
    }
public function updateTowTruckDetails($payload)
{
    $shop_id = $payload['user_id'];

    // Read request body first
    $data = json_decode(file_get_contents("php://input"), true);

    if (empty($data['request_id'])) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Request ID is required."
        ]);
        return;
    }

    // Check that the request belongs to this shop
    $request = $this->serviceRequestModel->getById($data['request_id']);

    if (!$request || $request['shop_id'] != $shop_id) {
        http_response_code(403);
        echo json_encode([
            "success" => false,
            "message" => "Unauthorized."
        ]);
        return;
    }

    try {
        $result = $this->serviceRequestModel->updateTowTruckDetails($data);

        if ($result) {
            echo json_encode([
                "success" => true
            ]);
        } else {
            http_response_code(500);
            echo json_encode([
                "success" => false,
                "message" => "Update failed — no rows affected."
            ]);
        }
    } catch (Throwable $e) {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Server error.",
            "debug" => $e->getMessage() // remove in production
        ]);
    }
}

    // ==========================================
    // CUSTOMER-SIDE HISTORY
    // ==========================================

    public function handleGetCustomerServiceHistory($payload)
{
    $customer_id = $payload['user_id'];
        $history = $this->serviceRequestModel->getServiceHistoryByCustomer($customer_id);

        http_response_code(200);
        return json_encode([
            "success" => true,
            "data"    => $history
        ]);
    }

    public function handleGetShopNotifications($payload)
{
    $shop_id = $payload['user_id'];
    $notifications =
        $this->serviceRequestModel
             ->getShopNotifications($shop_id);
     http_response_code(200);
    return json_encode([
        "success"=>true,
        "data"=>$notifications
    ]);
}

}
?>
