<?php
require_once __DIR__ . '/../../config/bootstrap.php';
require_once __DIR__ . '/../../controllers/ShopController.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["message" => "Method not allowed."]);
    exit();
}

try {
    $payload = AuthMiddleware::authenticate();
    if (($payload['role'] ?? '') !== 'shop_owner') {
        http_response_code(403);
        echo json_encode(["success" => false, "message" => "Shop owner access required."]);
        exit();
    }

    $db   = (new Database())->connect();
    $ctrl = new ShopController($db);
    $ctrl->updateShopServices($payload);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(["message" => "Server error.", "debug" => $e->getMessage()]);
}
