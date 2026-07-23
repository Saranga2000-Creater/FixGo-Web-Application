<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../config/EnvLoader.php';
EnvLoader::load(__DIR__ . '/../.env');

require_once __DIR__ . '/../config/Database.php';
require_once __DIR__ . '/../config/JwtHandler.php';
require_once __DIR__ . '/../models/Shop.php';
require_once __DIR__ . '/../controllers/ShopController.php';

// Get Authorization header
$headers = getallheaders();
$authHeader = $headers['Authorization'] ?? '';

if (!preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
    http_response_code(401);
    echo json_encode([
        "success" => false,
        "message" => "Authorization token missing."
    ]);
    exit();
}

$jwtHandler = new JwtHandler();
$payload = $jwtHandler->decode($matches[1]);

if ($payload === false) {
    http_response_code(401);
    echo json_encode([
        "success" => false,
        "message" => "Invalid or expired token."
    ]);
    exit();
}

$database = new Database();
$db = $database->connect();

$controller = new ShopController($db);
$controller->getTowTruckDetails($payload);