<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");

require_once __DIR__ . '/../config/EnvLoader.php';
EnvLoader::load(__DIR__ . '/../.env');

require_once __DIR__ . '/../config/Database.php';
require_once __DIR__ . '/../models/Shop.php';
require_once __DIR__ . '/../controllers/ShopController.php';

if (!isset($_GET['shop_id'])) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Missing shop_id parameter."
    ]);
    exit();
}

$database = new Database();
$db = $database->connect();

$controller = new ShopController($db);

$controller->getTowTruckDetails();