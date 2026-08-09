<?php

require_once __DIR__ . '/../config/bootstrap.php';
require_once __DIR__ . '/../controllers/PlatformReviewController.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed."]);
    exit();
}

$database = new Database();
$db = $database->connect();

$controller = new PlatformReviewController($db);
$controller->getReviews();
