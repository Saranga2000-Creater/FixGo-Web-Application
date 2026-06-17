<?php
require "config/EnvLoader.php";
EnvLoader::load(__DIR__ . '/.env');
require "config/Database.php";

try {
    $db = new Database();
    $conn = $db->connect();
    
    // Get all tables
    $stmt = $conn->query("SHOW TABLES");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    
    $result = [];
    foreach ($tables as $table) {
        $desc = $conn->query("DESCRIBE `$table`")->fetchAll(PDO::FETCH_ASSOC);
        $result[$table] = $desc;
    }
    echo json_encode($result, JSON_PRETTY_PRINT);
} catch (Exception $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>