<?php

require_once __DIR__ . '/../../config/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed."]);
    exit();
}

$payload = AuthMiddleware::authenticate();
$userId = $payload['user_id'] ?? $payload['id'] ?? null;

if (!$userId) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "User authentication failed. Please login to submit a report."]);
    exit();
}

$database = new Database();
$db = $database->connect();

$input = json_decode(file_get_contents("php://input"), true);
$shopId = isset($input['shop_id']) ? (int)$input['shop_id'] : 0;
$flagType = trim($input['flag_type'] ?? 'PROFILE FLAG');
$description = trim($input['description'] ?? '');

if ($shopId <= 0 || empty($description)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Shop ID and report description are required."]);
    exit();
}

try {
    // 1. Get reporter user info
    $reporterName = $payload['name'] ?? $payload['email'] ?? null;
    if (!$reporterName) {
        $userStmt = $db->prepare("SELECT name FROM customer WHERE id = ? UNION SELECT name FROM users WHERE id = ?");
        $userStmt->execute([$userId, $userId]);
        $userRow = $userStmt->fetch(PDO::FETCH_ASSOC);
        $reporterName = $userRow['name'] ?? "User #{$userId}";
    }

    // 2. Get shop details
    $shopStmt = $db->prepare("SELECT name FROM shop WHERE id = ?");
    $shopStmt->execute([$shopId]);
    $shopRow = $shopStmt->fetch(PDO::FETCH_ASSOC);
    $shopName = $shopRow['name'] ?? "Garage #{$shopId}";

    // 3. Insert into moderation_flags
    $insertSql = "INSERT INTO moderation_flags 
                  (entity_type, entity_id, flag_type, severity, reported_by_user, shop_name, description, status, created_at)
                  VALUES ('shop', :entity_id, :flag_type, 'medium', :reported_by, :shop_name, :description, 'pending', NOW())";
    
    $stmt = $db->prepare($insertSql);
    $stmt->execute([
        ':entity_id' => $shopId,
        ':flag_type' => $flagType,
        ':reported_by' => $reporterName,
        ':shop_name' => $shopName,
        ':description' => $description
    ]);

    echo json_encode([
        "success" => true,
        "message" => "Report submitted successfully. Our admin team will investigate this garage."
    ]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Failed to submit report.", "error" => $e->getMessage()]);
}
