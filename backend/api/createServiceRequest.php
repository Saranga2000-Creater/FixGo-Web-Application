<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once __DIR__ . '/../config/EnvLoader.php';
EnvLoader::load(__DIR__ . '/../.env');
require_once __DIR__ . '/../config/Database.php';
require_once __DIR__ . '/../controllers/ServiceRequestController.php';

$database = new Database();
$db = $database->connect();

// Instantiate the Controller
$controller = new ServiceRequestController($db);

// Get raw posted data and decode to an associative array
$rawData = json_decode(file_get_contents("php://input"), true);

// Get the HTTP headers from Apache/Nginx
$headers = apache_request_headers();

// Execute controller logic and echo the JSON response
echo $controller->handleCreateRequest($rawData, $headers);
?>