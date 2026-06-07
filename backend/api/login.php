<?php

ini_set('display_errors', 1);
error_reporting(E_ALL);
// Set headers for CORS handling & JSON content outputs
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
} else {
    header("Access-Control-Allow-Origin: *");
}
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Boot up environment configurations
require_once __DIR__ . '/../config/EnvLoader.php';
EnvLoader::load(__DIR__ . '/../.env');

// Require Database connection and Controller logic
require_once __DIR__ . '/../config/Database.php';
require_once __DIR__ . '/../controllers/AuthController.php';

// Instantiate classes
$database = new Database();
$db = $database->connect();

$authController = new AuthController($db);

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only handle POST requests
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $authController->login();
} else {
    http_response_code(405);
    echo json_encode(["message" => "Method not allowed."]);
}