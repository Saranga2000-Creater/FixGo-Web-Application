<?php

require_once __DIR__ . '/../config/bootstrap.php';

require_once __DIR__ . '/../controllers/ServiceRequestController.php';

$database = new Database();
$db = $database->connect();

$controller = new ServiceRequestController($db);

$rawData = json_decode(file_get_contents("php://input"), true);

if ($rawData === null) {
    http_response_code(400);
    echo json_encode([
        "message" => "Invalid request body."
    ]);
    exit();
}

$payload = AuthMiddleware::authenticate();

echo $controller->handleCreateRequest($rawData, $payload);