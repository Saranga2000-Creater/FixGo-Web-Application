<?php

require_once __DIR__ . '/../../config/bootstrap.php';
require_once __DIR__ . '/../../config/AuthMiddleware.php';

// Ensure only admins can access this route
AuthMiddleware::authenticate(['admin']);

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method Not Allowed"]);
    exit();
}

$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['terms']) || !is_array($input['terms'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Invalid input format. Expected a 'terms' array."]);
    exit();
}

$termsFile = __DIR__ . '/../../config/terms.json';

// Write the terms array directly to JSON
if (file_put_contents($termsFile, json_encode($input['terms'], JSON_PRETTY_PRINT))) {
    http_response_code(200);
    echo json_encode(["success" => true, "message" => "Terms and conditions updated successfully."]);
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Failed to update terms and conditions."]);
}
