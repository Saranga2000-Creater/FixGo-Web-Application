<?php
require_once __DIR__ . '/../config/EnvLoader.php';
EnvLoader::load(__DIR__ . '/../.env');
require_once __DIR__ . '/../config/Database.php';

try {
    $db = (new Database())->connect();
    
    // Delete if exists
    $db->exec("DELETE FROM users WHERE email = 'testlogin@gmail.com'");
    
    // Insert verified active user
    $passwordHash = password_hash("testpassword", PASSWORD_DEFAULT);
    $stmt = $db->prepare("INSERT INTO users (email, userRole, password, isActive, is_email_verified, verification_token) VALUES ('testlogin@gmail.com', 'customer', :pass, 1, 1, NULL)");
    $stmt->execute([':pass' => $passwordHash]);
    $userId = $db->lastInsertId();
    
    // Insert customer details
    $stmt = $db->prepare("INSERT INTO customer (id, name, contactNumber, address, profilePhoto) VALUES (:id, 'Test Login', '123', 'Address', 'uploads/customers/test.png')");
    $stmt->execute([':id' => $userId]);
    
    echo "Test user created successfully with ID: $userId\n";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
