<?php
// backend/api/markNotificationRead.php

ini_set('display_errors', 1);
error_reporting(E_ALL);

// CORS & Headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["message" => "Only POST requests are allowed."]);
    exit();
}

// Load Dependencies
require_once __DIR__ . '/../config/EnvLoader.php';
EnvLoader::load(__DIR__ . '/../.env');

require_once __DIR__ . '/../config/Database.php';
require_once __DIR__ . '/../config/AuthMiddleware.php';

// Read request body
$rawData = json_decode(file_get_contents("php://input"), true);

if ($rawData === null) {
    http_response_code(400);
    echo json_encode(["message" => "Invalid or missing JSON payload."]);
    exit();
}

try {

    // Verify JWT
    $payload = AuthMiddleware::authenticate();
    $userId  = $payload['user_id'] ?? null;

    if (!$userId) {
        http_response_code(401);
        echo json_encode(["success" => false, "message" => "Unauthorized."]);
        exit();
    }

    // Database connection
    $database = new Database();
    $db = $database->connect();

    if (!empty($rawData['notification_id'])) {
        // Mark a single notification as read — scoped to this user so one
        // customer can't flip another customer's notification.
        $stmt = $db->prepare(
            "UPDATE notification SET isRead = 1 WHERE id = :id AND user_id = :user_id"
        );
        $stmt->execute([
            'id'      => $rawData['notification_id'],
            'user_id' => $userId,
        ]);

    } elseif (!empty($rawData['mark_all'])) {
        // Mark all of this user's notifications as read
        $stmt = $db->prepare(
            "UPDATE notification SET isRead = 1 WHERE user_id = :user_id"
        );
        $stmt->execute(['user_id' => $userId]);

    } else {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Missing notification_id or mark_all."]);
        exit();
    }

    http_response_code(200);
    echo json_encode(["success" => true]);

} catch (Throwable $e) {

    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Server error.",
        "debug"   => $e->getMessage() // Remove in production
    ]);
}
