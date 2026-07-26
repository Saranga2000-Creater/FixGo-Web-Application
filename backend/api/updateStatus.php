<?php

require_once __DIR__ . '/../config/bootstrap.php';

require_once __DIR__ . '/../controllers/ServiceRequestController.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        "message" => "Only POST requests are allowed."
    ]);
    exit();
}

$rawData = json_decode(file_get_contents("php://input"), true);

if ($rawData === null) {
    http_response_code(400);
    echo json_encode([
        "message" => "Invalid or missing JSON payload."
    ]);
    exit();
}

try {

    $payload = AuthMiddleware::authenticate();

    $database = new Database();
    $db = $database->connect();

    $controller = new ServiceRequestController($db);

    echo $controller->handleUpdateStatus($rawData, $payload);

} catch (Throwable $e) {

    http_response_code(500);

    echo json_encode([
        "message" => "Server error.",
        "debug" => $e->getMessage()
    ]);
}