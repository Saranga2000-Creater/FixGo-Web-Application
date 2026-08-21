<?php

require_once __DIR__ . '/../../config/bootstrap.php';
require_once __DIR__ . '/../../middleware/AuthMiddleware.php';
require_once __DIR__ . '/../../controllers/BillingController.php';

AuthMiddleware::authenticate(['admin']);

$db = Database::getInstance()->getConnection();
$controller = new BillingController($db);

$controller->clearDrafts();
