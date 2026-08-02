<?php
require_once __DIR__ . '/../../config/bootstrap.php';
require_once __DIR__ . '/../../controllers/BillingController.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["message" => "Method not allowed."]);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);
if ($data === null || !isset($data['year'], $data['month'])) {
    http_response_code(400);
    echo json_encode(["message" => "Required fields: year, month."]);
    exit();
}

$year  = (int)$data['year'];
$month = (int)$data['month'];

if ($year < 2024 || $month < 1 || $month > 12) {
    http_response_code(400);
    echo json_encode(["message" => "Invalid year or month value."]);
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
    $ctrl->dispatchInvoices($year, $month);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(["message" => "Server error.", "debug" => $e->getMessage()]);
}
