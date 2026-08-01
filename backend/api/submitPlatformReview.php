<?php

require_once __DIR__ . '/../config/bootstrap.php';
require_once __DIR__ . '/../controllers/PlatformReviewController.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed."]);
    exit();
}

$payload = AuthMiddleware::authenticate();
$userId = $payload['user_id'] ?? $payload['id'] ?? null;

if (!$userId) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "User authentication failed."]);
    exit();
}

$database = new Database();
$db = $database->connect();

$data = json_decode(file_get_contents("php://input"));

$controller = new PlatformReviewController($db);
$controller->submitReview($userId, $data);
