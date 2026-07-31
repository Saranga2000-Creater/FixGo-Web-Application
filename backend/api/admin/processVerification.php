<?php
require_once __DIR__ . '/../../config/bootstrap.php';
require_once __DIR__ . '/../../controllers/BillingController.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["message" => "Method not allowed."]);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);
if ($data === null || !isset($data['invoiceId'], $data['action'])) {
    http_response_code(400);
    echo json_encode(["message" => "Required fields: invoiceId, action."]);
    exit();
}

try {
    $payload = AuthMiddleware::authenticate();
    if ($payload['role'] !== 'admin') {
        http_response_code(403);
        echo json_encode(["success" => false, "message" => "Admin access required."]);
        exit();
    }

    $db   = (new Database())->connect();
    $ctrl = new BillingController($db);
    $ctrl->processVerification(
        (int)$data['invoiceId'],
        (string)$data['action'],
        isset($data['reason']) ? (string)$data['reason'] : null,
        (int)$payload['user_id']
    );

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(["message" => "Server error.", "debug" => $e->getMessage()]);
}
