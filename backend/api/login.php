<?php

require_once __DIR__ . '/../config/bootstrap.php';

require_once __DIR__ . '/../controllers/AuthController.php';

$database = new Database();
$db = $database->connect();

$authController = new AuthController($db);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $authController->login();
} else {
    http_response_code(405);
    echo json_encode(["message" => "Method not allowed."]);
}