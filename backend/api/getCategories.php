<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once __DIR__ . '/../config/EnvLoader.php';
EnvLoader::load(__DIR__ . '/../.env');
// Use __DIR__ to make the file paths absolute and bulletproof
include_once __DIR__ . '/../config/Database.php';
include_once __DIR__ . '/../controllers/CategoryController.php';

// Initialize database connection
$database = new Database();
$db = $database->connect();

// Instantiate the controller and execute
$controller = new CategoryController($db);
$controller->getAllCategories();
?>