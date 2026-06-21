<?php
require_once __DIR__ . '/../config/EnvLoader.php';
EnvLoader::load(__DIR__ . '/../.env');
require_once __DIR__ . '/../config/Database.php';
require_once __DIR__ . '/../controllers/AuthController.php';

// Mock php://input content
$mockInput = json_encode([
    "email" => "new1@gmail.com",
    "password" => "password" // Let's check what password was registered, usually the user typed their password
]);

// We need to capture the output of login()
$db = (new Database())->connect();
$auth = new AuthController($db);

// We need to override the php://input in PHP. Since we can't easily override php://input directly, we can modify the controller or simulate its steps.
// Let's print out what we see in the controller logic directly:

$email = "new1@gmail.com";
$password = "password"; // wait, the user's password in user table was hashed. Let's see if we can check password validity.

$user = new User($db);
if ($user->findByEmail($email)) {
    echo "User found in db.\n";
    echo "isActive: " . $user->isActive . "\n";
    echo "is_email_verified: " . $user->is_email_verified . "\n";
    
    // Check password verify
    // Since we don't know the exact plain text password the user chose (they entered dots in the image, e.g. 8 dots), 
    // let's test if password_verify works with some common passwords or just check if the model query succeeded.
    echo "Password hash in DB: " . $user->password . "\n";
} else {
    echo "User NOT found in db.\n";
}
