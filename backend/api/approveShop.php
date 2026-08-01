<?php

require_once __DIR__ . '/../config/bootstrap.php';

// Authenticate and restrict to admin only
$payload = AuthMiddleware::authenticate();
$role = $payload['role'] ?? $payload['userRole'] ?? '';
if ($role !== 'admin') {
    http_response_code(403);
    echo json_encode(["success" => false, "message" => "Unauthorized access. Admin privileges required."]);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed."]);
    exit();
}

$rawInput = file_get_contents("php://input");
$data = json_decode($rawInput);

$shopId = isset($data->shopId) ? intval($data->shopId) : 0;

if ($shopId <= 0) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Valid shopId is required."]);
    exit();
}

$database = new Database();
$db = $database->connect();

// Activate the shop owner account
$stmt = $db->prepare("UPDATE users SET isActive = 1 WHERE id = :id AND userRole = 'shop_owner' AND is_email_verified = 1");
$stmt->bindParam(':id', $shopId, PDO::PARAM_INT);
$stmt->execute();

if ($stmt->rowCount() > 0) {
    http_response_code(200);
    echo json_encode(["success" => true, "message" => "Shop approved successfully."]);
} else {
    // The shop may already be active or not found
    $check = $db->prepare("SELECT isActive FROM users WHERE id = :id AND userRole = 'shop_owner'");
    $check->bindParam(':id', $shopId, PDO::PARAM_INT);
    $check->execute();
    $row = $check->fetch(PDO::FETCH_ASSOC);
    if ($row && $row['isActive'] == 1) {
        http_response_code(200);
        echo json_encode(["success" => true, "message" => "Shop is already active."]);
    } else {
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "Shop not found or email not yet verified."]);
    }
}
