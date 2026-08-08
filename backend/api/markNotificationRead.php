<?php

require_once __DIR__ . '/../config/bootstrap.php';
require_once __DIR__ . '/../controllers/NotificationController.php';

$db = (new Database())->connect();
$controller = new NotificationController($db);
$controller->markRead();