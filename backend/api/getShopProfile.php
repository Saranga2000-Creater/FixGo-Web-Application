<?php

// 1. CORS & Headers
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (preg_match('/^http:\/\/localhost:\d+$/', $origin)) {
    header("Access-Control-Allow-Origin: $origin");
} else {
    header("Access-Control-Allow-Origin: http://localhost:5173");
}
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// 2. Load Dependencies
require_once __DIR__ . '/../config/EnvLoader.php';
require_once __DIR__ . '/../config/Database.php';
require_once __DIR__ . '/../config/JwtHandler.php';
require_once __DIR__ . '/../controllers/ShopController.php';

EnvLoader::load(__DIR__ . '/../.env');

require_once __DIR__ . '/../config/AuthMiddleware.php';

$payload = AuthMiddleware::authenticate();

$database = new Database();
$db = $database->connect();

$controller = new ShopController($db);
$controller->getProfile($payload['user_id']);