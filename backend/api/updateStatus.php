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

// Pre-flight OPTIONS request handling for browsers
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Ensure the request is actually a POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Method Not Allowed
    echo json_encode(["message" => "Only POST requests are allowed for updating status."]);
    exit();
}

// 2. Load Dependencies
require_once __DIR__ . '/../config/EnvLoader.php';
EnvLoader::load(__DIR__ . '/../.env');
require_once __DIR__ . '/../config/Database.php';
require_once __DIR__ . '/../controllers/ServiceRequestController.php';

// 3. Initialize Database
$database = new Database();
$db = $database->connect();

// 4. Instantiate the Controller
$controller = new ServiceRequestController($db);

// 5. Capture the Request
$rawData = json_decode(file_get_contents("php://input"), true);
$headers = apache_request_headers();

// Safety Net for bad JSON
if ($rawData === null) {
    http_response_code(400);
    echo json_encode(["message" => "FATAL: Invalid or missing JSON payload."]);
    exit();
}

// 6. Execute the Bouncer Logic
echo $controller->handleUpdateStatus($rawData, $headers);
?>