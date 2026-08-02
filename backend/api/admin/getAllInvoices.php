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

    // Build filters from optional query params
    $filters = [];
    if (!empty($_GET['shopId']))  $filters['shopId']  = $_GET['shopId'];
    if (!empty($_GET['status']))  $filters['status']  = $_GET['status'];
    if (!empty($_GET['year']))    $filters['year']    = $_GET['year'];
    if (!empty($_GET['month']))   $filters['month']   = $_GET['month'];

    $db   = (new Database())->connect();
    $ctrl = new BillingController($db);
    $ctrl->getAllInvoices($filters);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(["message" => "Server error.", "debug" => $e->getMessage()]);
}
