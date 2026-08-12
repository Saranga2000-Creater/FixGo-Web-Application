<?php
require_once 'config/bootstrap.php';
$stmt = $db->query("SELECT * FROM users WHERE userRole = 'admin' LIMIT 1");
$admin = $stmt->fetch();
$token = (new AuthMiddleware())->generateToken($admin['id'], $admin['email'], $admin['userRole']);
echo $token;
