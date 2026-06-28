<?php

// Allow any localhost port (5173, 5174, etc.) for local development
//Setting Up Communication Rules (CORS)
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (preg_match('/^http:\/\/localhost:\d+$/', $origin)) {

    header("Access-Control-Allow-Origin: $origin");
} else {
    header("Access-Control-Allow-Origin: http://localhost:5173");
}
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Content-Type: application/json");

// Handle browser preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Load required files
require_once __DIR__ . '/../config/EnvLoader.php';
require_once __DIR__ . '/../config/Database.php';
require_once __DIR__ . '/../config/JwtHandler.php';
require_once __DIR__ . '/../controllers/CustomerController.php';

// Load environment variables before database connects
EnvLoader::load(__DIR__ . '/../.env');

// Step 1: Get JWT token from Authorization header
$headers = getallheaders();
$authHeader = $headers['Authorization'] ?? '';

if (empty($authHeader) || !str_starts_with($authHeader, 'Bearer ')) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'No token provided']);
    exit();
}

$token = substr($authHeader, 7); // Remove "Bearer " prefix

// Step 2: Verify and decode the token
$jwtHandler = new JwtHandler();
$decoded = $jwtHandler->decode($token);

if (!$decoded) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Invalid or expired token']);
    exit();
}

// Step 3: Extract customer ID from token
// Handles both array and object returns, and both 'user_id' and 'id' key names
if (is_array($decoded)) {
    $customerId = $decoded['user_id'] ?? $decoded['id'] ?? null;
} else {
    $customerId = $decoded->user_id ?? $decoded->id ?? null;
}

if (!$customerId) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid token payload']);
    exit();
}

// Step 4: Connect to database and fetch customer profile
$database = new Database();
$db = $database->connect();

$controller = new CustomerController($db);
$controller->getProfile($customerId);