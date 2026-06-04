<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../config/Database.php';
require_once '../config/jwt.php';

$database = new Database();
$conn = $database->connect();

$request_method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : '';

if ($request_method == 'POST') {
    $input = json_decode(file_get_contents("php://input"), true);

    if ($action == 'register') {
        register($conn, $input);
    } elseif ($action == 'login') {
        login($conn, $input);
    } else {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid action']);
    }
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
}

function register($conn, $data) {
    if (!isset($data['username']) || !isset($data['email']) || !isset($data['password'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Missing required fields']);
        return;
    }

    $username = $conn->real_escape_string(trim($data['username']));
    $email = $conn->real_escape_string(trim($data['email']));
    $password = password_hash($data['password'], PASSWORD_BCRYPT);

    // Check if user already exists
    $check_query = "SELECT id FROM users WHERE email = '$email' OR username = '$username'";
    $check_result = $conn->query($check_query);

    if ($check_result->num_rows > 0) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'User already exists']);
        return;
    }

    $query = "INSERT INTO users (username, email, password, role) VALUES ('$username', '$email', '$password', 'user')";

    if ($conn->query($query)) {
        http_response_code(201);
        echo json_encode(['success' => true, 'message' => 'User registered successfully']);
    } else {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Registration failed: ' . $conn->error]);
    }
}

function login($conn, $data) {
    if (!isset($data['email']) || !isset($data['password'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Missing email or password']);
        return;
    }

    $email = $conn->real_escape_string(trim($data['email']));
    $query = "SELECT id, username, email, password, role FROM users WHERE email = '$email'";
    $result = $conn->query($query);

    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        if (password_verify($data['password'], $user['password'])) {
            $token = JWT::createToken($user);
            http_response_code(200);
            echo json_encode([
                'success' => true,
                'message' => 'Login successful',
                'token' => $token,
                'user' => [
                    'id' => $user['id'],
                    'username' => $user['username'],
                    'email' => $user['email'],
                    'role' => $user['role']
                ]
            ]);
        } else {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Invalid password']);
        }
    } else {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'User not found']);
    }
}
?>
