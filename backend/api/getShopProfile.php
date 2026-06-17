<?php

// 1. CORS & Headers
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (preg_match('/^http:\/\/localhost:\d+$/', $origin)) {
    header("Access-Control-Allow-Origin: $origin");
} else {
    header("Access-Control-Allow-Origin: http://localhost:5173");
}
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// 2. Load Dependencies
require_once __DIR__ . '/../config/EnvLoader.php';
require_once __DIR__ . '/../config/Database.php';
require_once __DIR__ . '/../config/JwtHandler.php';
require_once __DIR__ . '/../controllers/ShopController.php';

EnvLoader::load(__DIR__ . '/../.env');

// 3. The Security Gateway (JWT Validation)
$headers = getallheaders();
$authHeader = $headers['Authorization'] ?? '';

if (empty($authHeader) || !str_starts_with($authHeader, 'Bearer ')) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized. No token provided.']);
    exit();
}

$token = substr($authHeader, 7);
$jwtHandler = new JwtHandler();
$decoded = $jwtHandler->decode($token);

if (!$decoded) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized. Invalid or expired token.']);
    exit();
}

// 4. Securely extract ID from token (NEVER from $_GET)
$shopId = is_array($decoded) ? ($decoded['user_id'] ?? $decoded['id'] ?? null) : ($decoded->user_id ?? $decoded->id ?? null);

if (!$shopId) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid token payload.']);
    exit();
}

// 5. Connect and Route to Controller
$database = new Database();
$db = $database->connect();

$controller = new ShopController($db);
$controller->getProfile($shopId);