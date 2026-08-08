<?php
require_once __DIR__ . '/../../config/bootstrap.php';
require_once __DIR__ . '/../../controllers/BillingController.php';

$payload = AuthMiddleware::authenticate();
if ($payload['role'] !== 'admin') {
    http_response_code(403);
    echo json_encode(["success" => false, "message" => "Admin access required."]);
    exit();
}

$db   = (new Database())->connect();
$ctrl = new BillingController($db);
$ctrl->getAllInvoices($_GET);
