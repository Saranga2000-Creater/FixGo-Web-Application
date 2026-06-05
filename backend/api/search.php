<?php
// Set required headers for a REST API
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once '../config/Database.php';
require_once '../models/Shop.php';
require_once '../controllers/SearchController.php';

$database = new Database();
$db = $database->connect();

$controller = new SearchController($db);

// Passing $_GET allows for easy testing in the browser before the frontend is built
echo $controller->handleSearchRequest($_GET);
?>