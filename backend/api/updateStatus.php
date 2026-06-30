<?php
// backend/api/updateStatus.php

ini_set('display_errors', 1);
error_reporting(E_ALL);

// CORS & Headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        "message" => "Only POST requests are allowed."
    ]);
    exit();
}

// Load Dependencies
require_once __DIR__ . '/../config/EnvLoader.php';
EnvLoader::load(__DIR__ . '/../.env');

require_once __DIR__ . '/../config/Database.php';
require_once __DIR__ . '/../config/AuthMiddleware.php';
require_once __DIR__ . '/../controllers/ServiceRequestController.php';

// Read request body
$rawData = json_decode(file_get_contents("php://input"), true);

if ($rawData === null) {
    http_response_code(400);
    echo json_encode([
        "message" => "Invalid or missing JSON payload."
    ]);
    exit();
}

try {

    // Verify JWT
    $payload = AuthMiddleware::authenticate();

    // Database connection
    $database = new Database();
    $db = $database->connect();

    // Controller
    $controller = new ServiceRequestController($db);

    echo $controller->handleUpdateStatus($rawData, $payload);

} catch (Throwable $e) {

    http_response_code(500);

    echo json_encode([
        "message" => "Server error.",
        "debug" => $e->getMessage() // Remove in production
    ]);
}