<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Set headers for CORS handling & JSON outputs
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
} else {
    header("Access-Control-Allow-Origin: *");
}
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Load environment config
require_once __DIR__ . '/../config/EnvLoader.php';
EnvLoader::load(__DIR__ . '/../.env');

require_once __DIR__ . '/../config/Database.php';
require_once __DIR__ . '/../config/EmailSender.php';

// Only handle POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["message" => "Method not allowed."]);
    exit();
}

// Check inputs in $_POST
$requiredFields = ['name', 'email', 'phone', 'address', 'password'];

foreach ($requiredFields as $field) {
    if (!isset($_POST[$field]) || trim($_POST[$field]) === '') {
        http_response_code(400);
        echo json_encode(["message" => "Missing required field: $field"]);
        exit();
    }
}

$name = trim($_POST['name']);
$email = trim($_POST['email']);
$phone = trim($_POST['phone']);
$address = trim($_POST['address']);
$password = $_POST['password'];

// Validate profile picture
if (!isset($_FILES['profilePic']) || $_FILES['profilePic']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(["message" => "Please upload a profile photo."]);
    exit();
}

$file = $_FILES['profilePic'];
$fileSize = $file['size'];
$fileTmp = $file['tmp_name'];
$fileName = $file['name'];

// Check file size (5MB max)
if ($fileSize > 5 * 1024 * 1024) {
    http_response_code(400);
    echo json_encode(["message" => "Profile photo must be under 5MB."]);
    exit();
}

// Check file type
$allowedExtensions = ['jpg', 'jpeg', 'png', 'webp'];
$fileExtension = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));

if (!in_array($fileExtension, $allowedExtensions)) {
    http_response_code(400);
    echo json_encode(["message" => "Invalid image format. Allowed formats: PNG, JPG, JPEG, WEBP."]);
    exit();
}

// Create uploads/customers folder if not exists
$targetDir = __DIR__ . '/../uploads/customers/';
if (!file_exists($targetDir)) {
    mkdir($targetDir, 0777, true);
}

// Generate a unique file name
$uniqueFileName = uniqid('customer_', true) . '.' . $fileExtension;
$targetFilePath = $targetDir . $uniqueFileName;
$dbImagePath = 'uploads/customers/' . $uniqueFileName;

// Connect database
$database = new Database();
$db = $database->connect();

// Verify user email doesn't exist
$checkUser = $db->prepare("SELECT id FROM users WHERE email = :email");
$checkUser->execute([':email' => $email]);
if ($checkUser->rowCount() > 0) {
    http_response_code(400);
    echo json_encode(["message" => "Email is already registered."]);
    exit();
}

// Move file
if (!move_uploaded_file($fileTmp, $targetFilePath)) {
    http_response_code(500);
    echo json_encode(["message" => "Failed to save uploaded photo."]);
    exit();
}

// Transaction block
try {
    $db->beginTransaction();

    // Hash password
    $passwordHash = password_hash($password, PASSWORD_DEFAULT);

    // Generate verification token
    $verificationToken = bin2hex(random_bytes(32));

    // 1. Insert into users
    $userQuery = "INSERT INTO users (email, userRole, password, isActive, verification_token, is_email_verified) 
                  VALUES (:email, 'customer', :password, 0, :token, 0)";
    $userStmt = $db->prepare($userQuery);
    $userStmt->execute([
        ':email' => $email,
        ':password' => $passwordHash,
        ':token' => $verificationToken
    ]);
    
    $userId = $db->lastInsertId();

    // 2. Insert into customer
    $customerQuery = "INSERT INTO customer (id, name, contactNumber, address, profilePhoto) 
                      VALUES (:id, :name, :contactNumber, :address, :profilePhoto)";
    
    $customerStmt = $db->prepare($customerQuery);
    $customerStmt->execute([
        ':id' => $userId,
        ':name' => $name,
        ':contactNumber' => $phone,
        ':address' => $address,
        ':profilePhoto' => $dbImagePath
    ]);

    $db->commit();

    // Send verification email
    EmailSender::sendVerificationEmail($email, $verificationToken);
    
    http_response_code(201);
    echo json_encode(["message" => "Customer registered successfully. Please check your email to verify your account."]);

} catch (Exception $e) {
    $db->rollBack();
    // Delete file if db commit failed
    if (file_exists($targetFilePath)) {
        unlink($targetFilePath);
    }
    http_response_code(500);
    echo json_encode(["message" => "Database registration failed: " . $e->getMessage()]);
}
?>
