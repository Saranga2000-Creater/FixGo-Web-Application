<?php

require_once __DIR__ . '/../config/bootstrap.php';

require_once __DIR__ . '/../controllers/ServiceRequestController.php';

try {

    $payload = AuthMiddleware::authenticate();

    $database = new Database();
    $db = $database->connect();

    $controller = new ServiceRequestController($db);

    echo $controller->handleGetServiceHistory($payload);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Server error.",
        "debug"   => $e->getMessage()
    ]);
}
