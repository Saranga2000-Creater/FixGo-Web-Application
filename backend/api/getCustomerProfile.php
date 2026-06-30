<?php

// Allow any localhost port (5173, 5174, etc.) for local development
//Setting Up Communication Rules (CORS)
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (preg_match('/^http:\/\/localhost:\d+$/', $origin)) {

    header("Access-Control-Allow-Origin: $origin");
} else {
    header("Access-Control-Allow-Origin: http://localhost:5173");
}
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Content-Type: application/json");

// Handle browser preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Load required files
require_once __DIR__ . '/../config/EnvLoader.php';
require_once __DIR__ . '/../config/Database.php';
require_once __DIR__ . '/../controllers/CustomerController.php';
require_once __DIR__ . '/../config/AuthMiddleware.php';

// Load environment variables before database connects
EnvLoader::load(__DIR__ . '/../.env');


$payload = AuthMiddleware::authenticate();

// Step 4: Connect to database and fetch customer profile
$database = new Database();
$db = $database->connect();

$controller = new CustomerController($db);
$controller->getProfile($payload['user_id']);

