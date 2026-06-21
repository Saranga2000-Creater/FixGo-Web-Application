<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once __DIR__ . '/../config/EnvLoader.php';
EnvLoader::load(__DIR__ . '/../.env');
require_once __DIR__ . '/../config/Database.php';
require_once __DIR__ . '/../controllers/ServiceRequestController.php';

$database = new Database();
$db = $database->connect();

$controller = new ServiceRequestController($db);

$shop_id = $_GET['shop_id'];
echo $controller->handleGetServiceHistory($shop_id);
?>
