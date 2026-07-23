<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, OPTIONS");

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

$payload = AuthMiddleware::authenticate();

$controller = new ServiceRequestController($db);

echo $controller->handleGetCustomerServiceHistory($payload);