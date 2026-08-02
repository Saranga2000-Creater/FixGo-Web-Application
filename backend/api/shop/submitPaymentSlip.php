<?php
require_once __DIR__ . '/../../config/bootstrap.php';
require_once __DIR__ . '/../../controllers/BillingController.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["message" => "Method not allowed."]);
    exit();
}

// This endpoint uses multipart/form-data — do NOT use json_decode(php://input)
if (empty($_POST['invoiceId']) || empty($_POST['paymentReference'])) {
    http_response_code(400);
    echo json_encode(["message" => "Required fields: invoiceId, paymentReference."]);
    exit();
}

if (!isset($_FILES['paymentSlip']) || $_FILES['paymentSlip']['error'] !== UPLOAD_ERR_OK) {
    $errCode = $_FILES['paymentSlip']['error'] ?? 'no file';
    http_response_code(400);
    echo json_encode(["message" => "Payment slip file is required. Upload error code: $errCode"]);
    exit();
}

try {
    $payload = AuthMiddleware::authenticate();
    if ($payload['role'] !== 'shop_owner') {
        http_response_code(403);
        echo json_encode(["success" => false, "message" => "Shop owner access required."]);
        exit();
    }

    $db   = (new Database())->connect();
    $ctrl = new BillingController($db);
    $ctrl->submitPaymentSlip(
        (int)$_POST['invoiceId'],
        trim($_POST['paymentReference']),
        $_FILES['paymentSlip'],
        (int)$payload['user_id']
    );

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(["message" => "Server error.", "debug" => $e->getMessage()]);
}
