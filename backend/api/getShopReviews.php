<?php
// backend/api/getShopReviews.php

ini_set('display_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../config/EnvLoader.php';
EnvLoader::load(__DIR__ . '/../.env');

require_once __DIR__ . '/../config/Database.php';

try {
    $shopId = $_GET['shop_id'] ?? null;
    if (!$shopId) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "shop_id is required"]);
        exit();
    }

    $database = new Database();
    $db = $database->connect();

    $stmt = $db->prepare("
        SELECT r.id, r.rating, r.comment, r.created_at,
               c.name AS customer_name
        FROM review r
        JOIN customer c ON c.id = r.customer_id
        WHERE r.shop_id = ?
        ORDER BY r.created_at DESC
    ");
    $stmt->execute([$shopId]);
    $reviews = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $summaryStmt = $db->prepare("
        SELECT ROUND(AVG(rating), 1) AS average_rating, COUNT(*) AS total_reviews
        FROM review
        WHERE shop_id = ?
    ");
    $summaryStmt->execute([$shopId]);
    $summary = $summaryStmt->fetch(PDO::FETCH_ASSOC);

    http_response_code(200);
    echo json_encode([
        "success" => true,
        "average_rating" => $summary['average_rating'] ? (float)$summary['average_rating'] : 0,
        "total_reviews" => (int)$summary['total_reviews'],
        "data" => $reviews
    ]);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Server error.",
        "debug"   => $e->getMessage() // Remove in production
    ]);
}