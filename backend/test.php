<?php

require "config/EnvLoader.php";
EnvLoader::load(__DIR__ . '/.env');

require "config/Database.php";

try {
    $db = new Database();
    $conn = $db->connect();
    echo json_encode(["message" => "Database connection successful"]);
} catch (Exception $e) {
    echo json_encode(["message" => "Database connection failed: " . $e->getMessage()]);
}
?>