<?php

require_once __DIR__ . '/../models/Customer.php';
require_once __DIR__ . '/../models/userRole.php';
require_once __DIR__ . '/../config/EmailSender.php';

class CustomerController {
    private $db;
    private $baseUrl;

    public function __construct($db) {
        $this->db = $db;
        $this->baseUrl = rtrim(getenv('APP_URL') ?: 'http://localhost:8000', '/');
    }

    public function getProfile($customerId) {
        $customerModel = new Customer($this->db);
        $customer = $customerModel->getById($customerId);

        if (!$customer) {
            http_response_code(404);
            echo json_encode([
                'success' => false,
                'message' => 'Customer not found'
            ]);
            return;
        }

        $photoUrl = null;
        if (!empty($customer['profilePhoto'])) {
            $photoUrl = $this->baseUrl . '/' . $customer['profilePhoto'];
        }

        echo json_encode([
            'success'       => true,
            'id'            => $customer['id'],
            'name'          => $customer['name'],
            'email'         => $customer['email'],
            'contactNumber' => $customer['contactNumber'],
            'address'       => $customer['address'],
            'profilePhoto'  => $photoUrl,
            'memberSince'   => date('F d, Y', strtotime($customer['createdAt'])),
        ]);
    }

    public function register() {
        // Only handle POST requests
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            http_response_code(405);
            echo json_encode(["message" => "Method not allowed."]);
            return;
        }

        // Check inputs in $_POST
        $requiredFields = ['name', 'email', 'phone', 'address', 'password'];
        foreach ($requiredFields as $field) {
            if (!isset($_POST[$field]) || trim($_POST[$field]) === '') {
                http_response_code(400);
                echo json_encode(["message" => "Missing required field: $field"]);
                return;
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
            return;
        }

        $file = $_FILES['profilePic'];
        $fileSize = $file['size'];
        $fileTmp = $file['tmp_name'];
        $fileName = $file['name'];

        // Check file size (5MB max)
        if ($fileSize > 5 * 1024 * 1024) {
            http_response_code(400);
            echo json_encode(["message" => "Profile photo must be under 5MB."]);
            return;
        }

        // Check file type
        $allowedExtensions = ['jpg', 'jpeg', 'png', 'webp'];
        $fileExtension = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));

        if (!in_array($fileExtension, $allowedExtensions)) {
            http_response_code(400);
            echo json_encode(["message" => "Invalid image format. Allowed formats: PNG, JPG, JPEG, WEBP."]);
            return;
        }

        // Check if email already exists
        $userModel = new User($this->db);
        if ($userModel->findByEmail($email)) {
            http_response_code(400);
            echo json_encode(["message" => "Email is already registered."]);
            return;
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

        // Move file
        if (!move_uploaded_file($fileTmp, $targetFilePath)) {
            http_response_code(500);
            echo json_encode(["message" => "Failed to save uploaded photo."]);
            return;
        }

        try {
            $passwordHash = password_hash($password, PASSWORD_DEFAULT);
            $verificationToken = bin2hex(random_bytes(32));

            $customerModel = new Customer($this->db);
            
            $userData = [
                'email' => $email,
                'password' => $passwordHash,
                'verification_token' => $verificationToken
            ];

            $customerData = [
                'name' => $name,
                'contactNumber' => $phone,
                'address' => $address,
                'profilePhoto' => $dbImagePath
            ];

            $customerModel->register($userData, $customerData);

            // Send verification email
            EmailSender::sendVerificationEmail($email, $verificationToken);

            http_response_code(201);
            echo json_encode(["message" => "Customer registered successfully. Please check your email to verify your account."]);

        } catch (Exception $e) {
            // Delete file if db commit failed
            if (file_exists($targetFilePath)) {
                unlink($targetFilePath);
            }
            http_response_code(500);
            echo json_encode(["message" => "Database registration failed: " . $e->getMessage()]);
        }
    }
}