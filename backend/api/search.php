<?php
// Set required headers for a REST API
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__.'/../config/EnvLoader.php';
EnvLoader::load(__DIR__.'/../.env');
require_once __DIR__ . '/../config/Database.php';
require_once __DIR__ . '/../config/JwtHandler.php';
require_once __DIR__ . '/../models/Shop.php';
require_once __DIR__ . '/../controllers/SearchController.php';

//security gateway (JWT validation)
$headers = getallheaders();
$authHeader = $headers['Authorization'] ?? '';

if (empty($authHeader) || !str_starts_with($authHeader, 'Bearer ')) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized access. No token provided.']);
    exit();
}

$token = substr($authHeader, 7);
$jwtHandler = new JwtHandler();
$decoded = $jwtHandler->decode($token);

if (!$decoded) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized access. Invalid or expired token.']);
    exit();
}

$database = new Database();
$db = $database->connect();

$controller = new SearchController($db);

// Passing $_GET allows for easy testing in the browser before the frontend is built
echo $controller->handleSearchRequest($_GET);
?>