<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

header("Content-Type: application/json; charset=UTF-8");

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