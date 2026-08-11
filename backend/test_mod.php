<?php
$_SERVER['REQUEST_METHOD'] = 'GET';
require_once __DIR__ . '/config/bootstrap.php';
require_once __DIR__ . '/controllers/AdminController.php';

$controller = new AdminController($db);
echo "=== Testing getModerationFlags ===\n";
ob_start();
$controller->getModerationFlags(['user_id' => 1]);
$output = ob_get_clean();
echo json_encode(json_decode($output), JSON_PRETTY_PRINT) . "\n\n";
