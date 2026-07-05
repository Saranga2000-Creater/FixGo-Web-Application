<?php
// backend/api/getNotifications.php

ini_set('display_errors', 1);
error_reporting(E_ALL);

// CORS & Headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Load Dependencies
require_once __DIR__ . '/../config/EnvLoader.php';
EnvLoader::load(__DIR__ . '/../.env');

require_once __DIR__ . '/../config/Database.php';
require_once __DIR__ . '/../config/AuthMiddleware.php';

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

    // NOTE: `notification` has no status column of its own — `type` already
    // stores the status snapshot at creation time (e.g. 'Accepted',
    // 'In Progress', 'Completed'), so it's aliased to `status` here for the
    // frontend. `notification` also has no created_at column, so the
    // linked servicerequest's created_at is used for the timestamp instead.
    $stmt = $db->prepare(
        "SELECT
            n.id,
            n.service_request_id,
            n.type,
            n.title,
            n.message,
            n.isRead,
            n.type AS status,
            sr.status AS current_status,
            sr.shop_id,
            sr.requires_tow,
            sr.vehicle_brand,
            sr.dispatched_driver_name,
            sr.dispatched_driver_phone,
            sr.dispatched_truck_brand,
            sr.dispatched_truck_color,
            sr.dispatched_truck_plate,
            sr.promised_eta,
            sr.pickup_landmark,
            sr.created_at,
            s.name AS shop_name
         FROM notification n
         LEFT JOIN servicerequest sr ON n.service_request_id = sr.id
         LEFT JOIN shop s ON sr.shop_id = s.id
         WHERE n.user_id = :user_id
         ORDER BY n.id DESC"
    );
    $stmt->execute(['user_id' => $userId]);
    $notifications = $stmt->fetchAll(PDO::FETCH_ASSOC);

    http_response_code(200);
    echo json_encode(["success" => true, "data" => $notifications]);

} catch (Throwable $e) {

    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Server error.",
        "debug"   => $e->getMessage() // Remove in production
    ]);
}
