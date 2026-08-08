<?php

require_once __DIR__ . '/../config/bootstrap.php';
require_once __DIR__ . '/../controllers/AdminController.php';

$payload = AuthMiddleware::authenticate();
$role = $payload['role'] ?? $payload['userRole'] ?? '';
if ($role !== 'admin') {
    http_response_code(403);
    echo json_encode(["success" => false, "message" => "Unauthorized access. Admin privileges required."]);
    exit();
}

$db = (new Database())->connect();
$controller = new AdminController($db);
$controller->getPendingShops();
