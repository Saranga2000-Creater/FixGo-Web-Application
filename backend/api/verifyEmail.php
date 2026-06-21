<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Set headers for CORS handling & JSON outputs
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
} else {
    header("Access-Control-Allow-Origin: *");
}
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
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

// Only handle POST and GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST' && $_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(["message" => "Method not allowed."]);
    exit();
}

// Retrieve token
$token = null;
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    $token = isset($data->token) ? trim($data->token) : null;
} else if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $token = isset($_GET['token']) ? trim($_GET['token']) : null;
}

if (empty($token)) {
    http_response_code(400);
    echo json_encode(["message" => "Verification token is required."]);
    exit();
}

// Connect database
$database = new Database();
$db = $database->connect();

try {
    // Check if token exists
    $stmt = $db->prepare("SELECT id, email FROM users WHERE verification_token = :token LIMIT 1");
    $stmt->execute([':token' => $token]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        http_response_code(400);
        echo json_encode(["message" => "Invalid or expired verification token."]);
        exit();
    }

    $userId = $user['id'];

    // Update user status
    $db->beginTransaction();
    
    $updateStmt = $db->prepare("UPDATE users SET is_email_verified = 1, isActive = 1, verification_token = NULL WHERE id = :id");
    $updateStmt->execute([':id' => $userId]);
    
    $db->commit();

    http_response_code(200);
    echo json_encode(["message" => "Email verified successfully. You can now log in to your account."]);

} catch (Exception $e) {
    if ($db->inTransaction()) {
        $db->rollBack();
    }
    http_response_code(500);
    echo json_encode(["message" => "Verification failed: " . $e->getMessage()]);
}
?>
