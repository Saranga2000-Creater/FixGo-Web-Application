<?php
// backend/api/update_status.php

ini_set('display_errors', 1);
error_reporting(E_ALL);

// 1. CORS & Headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["message" => "Only POST requests are allowed for updating status."]);
    exit();
}

// 2. Load Dependencies
require_once __DIR__ . '/../config/EnvLoader.php';
EnvLoader::load(__DIR__ . '/../.env');
require_once __DIR__ . '/../config/Database.php';
require_once __DIR__ . '/../controllers/ServiceRequestController.php';

// 3. Capture the Request
$rawData = json_decode(file_get_contents("php://input"), true);
$headers = getallheaders(); // portable across Apache, php-fpm, and the built-in server

if ($rawData === null) {
    http_response_code(400);
    echo json_encode(["message" => "FATAL: Invalid or missing JSON payload."]);
    exit();
}

// 4. Connect + Route (wrapped so a DB failure still returns clean JSON)
try {
    $database = new Database();
    $db = $database->connect();

    $controller = new ServiceRequestController($db);
    echo $controller->handleUpdateStatus($rawData, $headers);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "message" => "Server error.",
        // remove this in production — useful while you're still debugging on different machines
        "debug"   => $e->getMessage()
    ]);
}
?>