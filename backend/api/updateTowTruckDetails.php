<?php

require_once __DIR__ . '/../config/bootstrap.php';

require_once __DIR__ . '/../models/Shop.php';
require_once __DIR__ . '/../controllers/ServiceRequestController.php';

$database = new Database();
$db = $database->connect();

$payload = AuthMiddleware::authenticate();
$controller = new ServiceRequestController($db);

$controller->updateTowTruckDetails($payload);