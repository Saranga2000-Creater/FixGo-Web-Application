<?php

require_once __DIR__ . '/../../config/bootstrap.php';
require_once __DIR__ . '/../../controllers/AdminController.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed."]);
    exit();
}

try {
    $payload = AuthMiddleware::authenticate();
    
    // Restrict access to admin only
    if (($payload['role'] ?? $payload['userRole'] ?? '') !== 'admin') {
        http_response_code(403);
        echo json_encode(["success" => false, "message" => "Admin access required."]);
        exit();
    }

    $db = (new Database())->connect();
    $controller = new AdminController($db);
    
    $controller->getDashboardOverview();

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false, 
        "message" => "Server error.", 
        "debug" => $e->getMessage()
    ]);
}
