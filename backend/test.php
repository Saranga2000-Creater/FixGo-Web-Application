<?php
require "config/database.php";
try {
    $db = new Database();
    $conn = $db->connect();
    echo json_encode(["message" => "Database connection successful"]);
} catch (Exception $e) {
    echo json_encode(["message" => "Database connection failed: " . $e->getMessage()]);
}
?>