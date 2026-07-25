<?php
require_once __DIR__ . '/config/EnvLoader.php';
EnvLoader::load(__DIR__ . '/.env');
require_once __DIR__ . '/config/Database.php';
$database = new Database();
$db = $database->connect();
$q = $db->query("SHOW COLUMNS FROM users LIKE 'reset_token'");
print_r($q->fetchAll(PDO::FETCH_ASSOC));
