<?php

require_once __DIR__ . '/../config/bootstrap.php';

require_once __DIR__ . '/../controllers/NotificationController.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["message" => "Only POST requests are allowed."]);
    exit();
}

$db = (new Database())->connect();
$controller = new NotificationController($db);
$controller->markRead();