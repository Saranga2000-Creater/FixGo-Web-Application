<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

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

//---SAFETY NET ---
if ($rawData === null) {
    http_response_code(400);
    echo json_encode(["message" => "FATAL: PHP received empty or unreadable JSON."]);
    exit();
}

// Get the HTTP headers from Apache/Nginx
$headers = apache_request_headers();

// Execute controller logic and echo the JSON response
echo $controller->handleCreateRequest($rawData, $headers);
?>