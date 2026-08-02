<?php
require_once __DIR__ . '/../../config/bootstrap.php';
require_once __DIR__ . '/../../controllers/BillingController.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(["message" => "Method not allowed."]);
    exit();
}

try {
    $payload = AuthMiddleware::authenticate();
    if ($payload['role'] !== 'admin') {
        http_response_code(403);
        echo json_encode(["success" => false, "message" => "Admin access required."]);
        exit();
    }

    $year  = isset($_GET['year'])  ? (int)$_GET['year']  : null;
    $month = isset($_GET['month']) ? (int)$_GET['month'] : null;

    $db   = (new Database())->connect();
    $ctrl = new BillingController($db);
    $ctrl->getDrafts($year, $month);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(["message" => "Server error.", "debug" => $e->getMessage()]);
}
