<?php
require_once __DIR__ . '/../config/Database.php';
require_once __DIR__ . '/../models/Shop.php';
require_once __DIR__ . '/../controllers/ShopController.php';
require_once __DIR__.'/../config/EnvLoader.php';
EnvLoader::load(__DIR__.'/../.env');

// 1. CRITICAL: Allow CORS and the OPTIONS preflight method
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS"); 
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Allow our JWT header

// 2. CRITICAL: Safely answer the browser's Preflight Request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$db = new Database();
$connection = $db->connect();

// 3. CRITICAL BUG FIX: Pass the raw connection to the Controller!
$controller = new ShopController($connection);

// Trigger the controller function
$controller->getDetails();