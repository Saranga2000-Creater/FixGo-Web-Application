<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");

require_once __DIR__ . '/../config/EnvLoader.php';
EnvLoader::load(__DIR__ . '/../.env');

require_once __DIR__ . '/../config/Database.php';
require_once __DIR__ . '/../controllers/ServiceRequestController.php';

// Check if shop_id is provided
if (!isset($_GET['shop_id'])) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Missing shop_id parameter."
    ]);
    exit();
}

// Database connection
$database = new Database();
$db = $database->connect();

// Controller
$controller = new ServiceRequestController($db);

// Return notifications
echo $controller->handleGetShopNotifications($_GET['shop_id']);
?>