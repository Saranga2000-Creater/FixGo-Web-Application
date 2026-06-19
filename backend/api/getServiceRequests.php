<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once __DIR__ . '/../config/Database.php';
require_once __DIR__ . '/../controllers/ServiceRequestController.php';
require_once __DIR__ . '/../config/EnvLoader.php';
EnvLoader::load(__DIR__ . '/../.env');

$database = new Database();
$db = $database->connect();

$controller = new ServiceRequestController($db);

if(!isset($_GET['shop_id']))
{
    http_response_code(400);

    echo json_encode([
        "message" => "shop_id required"
    ]);

    exit();
}

$shop_id = $_GET['shop_id'];

echo $controller->getRequestsByShop($shop_id);