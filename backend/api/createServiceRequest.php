<?php

ini_set('display_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../config/EnvLoader.php';
EnvLoader::load(__DIR__ . '/../.env');

require_once __DIR__ . '/../config/Database.php';
require_once __DIR__ . '/../config/AuthMiddleware.php';
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