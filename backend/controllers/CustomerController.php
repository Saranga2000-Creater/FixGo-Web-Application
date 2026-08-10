<?php

require_once __DIR__ . '/../models/Customer.php';
require_once __DIR__ . '/../models/userRole.php';
require_once __DIR__ . '/../config/EmailSender.php';
require_once __DIR__ . '/../models/CustomerVehicle.php';

class CustomerController {
    private $db;
    private $baseUrl;

    public function __construct($db) {
        $this->db = $db;
        $this->baseUrl = rtrim(getenv('APP_URL') ?: 'http://localhost:8000', '/');
    }

    public function getProfile($customerId) {
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            http_response_code(405);
            echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
            return;
        }

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
        if (mb_strlen($name) < 2 || preg_match('/^\d+$/', $name) || !preg_match('/^[a-zA-Z\p{L}\s\.\'-]{2,100}$/u', $name)) {
            http_response_code(400);
            echo json_encode(["message" => "Please enter a valid full name (letters only, at least 2 characters)."]);
            return;
        }

        $email = trim($_POST['email']);
        $phone = trim($_POST['phone']);
        $address = trim($_POST['address']);
        $password = $_POST['password'];

        $sanitizedEmail = filter_var($email, FILTER_SANITIZE_EMAIL);
        if (!filter_var($sanitizedEmail, FILTER_VALIDATE_EMAIL)) {
            http_response_code(400);
            echo json_encode(["message" => "Invalid email format."]);
            return;
        }

        if (!preg_match('/^(?:\+94\d{9}|0\d{9})$/', $phone)) {
            http_response_code(400);
            echo json_encode(["message" => "Invalid phone number format. Valid formats: +94123456789 or 0123456789."]);
            return;
        }

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
        if ($userModel->findByEmail($sanitizedEmail)) {
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
            $verificationToken = str_pad((string)random_int(0, 999999), 6, '0', STR_PAD_LEFT);

            $customerModel = new Customer($this->db);

            $userData = [
                'email' => $sanitizedEmail,
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
            EmailSender::sendVerificationEmail($sanitizedEmail, $verificationToken);

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

    public function updateProfile($customerId) {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            http_response_code(405);
            echo json_encode(["message" => "Method not allowed."]);
            return;
        }

        $input = $_POST;
        if (empty($input)) {
            $jsonInput = json_decode(file_get_contents('php://input'), true);
            if (is_array($jsonInput)) {
                $input = $jsonInput;
            }
        }

        $customerModel = new Customer($this->db);
        $existingCustomer = $customerModel->getById($customerId);
        if (!$existingCustomer) {
            http_response_code(404);
            echo json_encode(["message" => "Customer not found."]);
            return;
        }

        $updateData = [];

        // Validate Name
        if (isset($input['name'])) {
            $name = trim($input['name']);
            if ($name === '') {
                http_response_code(400);
                echo json_encode(["message" => "Name cannot be empty."]);
                return;
            }
            $updateData['name'] = $name;
        }

        // Validate Phone Number
        $phone = isset($input['phone']) ? trim($input['phone']) : (isset($input['contactNumber']) ? trim($input['contactNumber']) : null);
        if ($phone !== null) {
            if ($phone === '') {
                http_response_code(400);
                echo json_encode(["message" => "Phone number cannot be empty."]);
                return;
            }
            if (!preg_match('/^(?:\+94\d{9}|0\d{9})$/', $phone)) {
                http_response_code(400);
                echo json_encode(["message" => "Invalid phone number format. Valid formats: +94123456789 or 0123456789."]);
                return;
            }
            $updateData['contactNumber'] = $phone;
        }

        // Validate Address
        if (isset($input['address'])) {
            $address = trim($input['address']);
            if ($address === '') {
                http_response_code(400);
                echo json_encode(["message" => "Address cannot be empty."]);
                return;
            }
            $updateData['address'] = $address;
        }

        // Handle Profile Photo Upload
        $fileKey = isset($_FILES['profilePic']) ? 'profilePic' : (isset($_FILES['profilePhoto']) ? 'profilePhoto' : null);
        if ($fileKey && isset($_FILES[$fileKey]) && $_FILES[$fileKey]['error'] === UPLOAD_ERR_OK) {
            $file = $_FILES[$fileKey];
            $fileSize = $file['size'];
            $fileTmp = $file['tmp_name'];
            $fileName = $file['name'];

            if ($fileSize > 5 * 1024 * 1024) {
                http_response_code(400);
                echo json_encode(["message" => "Profile photo must be under 5MB."]);
                return;
            }

            $allowedExtensions = ['jpg', 'jpeg', 'png', 'webp'];
            $fileExtension = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));

            if (!in_array($fileExtension, $allowedExtensions)) {
                http_response_code(400);
                echo json_encode(["message" => "Invalid image format. Allowed formats: PNG, JPG, JPEG, WEBP."]);
                return;
            }

            $targetDir = __DIR__ . '/../uploads/customers/';
            if (!file_exists($targetDir)) {
                mkdir($targetDir, 0777, true);
            }

            $uniqueFileName = uniqid('customer_', true) . '.' . $fileExtension;
            $targetFilePath = $targetDir . $uniqueFileName;
            $dbImagePath = 'uploads/customers/' . $uniqueFileName;

            if (!move_uploaded_file($fileTmp, $targetFilePath)) {
                http_response_code(500);
                echo json_encode(["message" => "Failed to save uploaded photo."]);
                return;
            }

            $updateData['profilePhoto'] = $dbImagePath;
        }

        // Handle Password Change
        $newPassword = isset($input['newPassword']) ? $input['newPassword'] : (isset($input['password']) ? $input['password'] : null);
        if ($newPassword !== null && trim($newPassword) !== '') {
            $currentPassword = isset($input['currentPassword']) ? $input['currentPassword'] : null;
            if (!$currentPassword || trim($currentPassword) === '') {
                http_response_code(400);
                echo json_encode(["message" => "Current password is required to change password."]);
                return;
            }

            // Verify current password
            require_once __DIR__ . '/../models/userRole.php';
            $userModel = new User($this->db);

            if (!$userModel->verifyPassword($customerId, $currentPassword)) {
                http_response_code(400);
                echo json_encode(["message" => "Current password is incorrect."]);
                return;
            }

            if (strlen($newPassword) < 6) {
                http_response_code(400);
                echo json_encode(["message" => "New password must be at least 6 characters long."]);
                return;
            }
        } else {
            $newPassword = null;
        }

        try {
            $customerModel->updateProfile($customerId, $updateData, $newPassword);
            $this->getProfile($customerId);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["message" => "Failed to update profile: " . $e->getMessage()]);
        }
    }

    // ==========================================
    // "My Garage" Vehicle Management
    // ==========================================

    public function handleGetVehicles($payload) {
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            http_response_code(405);
            echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
            return;
        }

        $customer_id = $payload['user_id'];
        $vehicleModel = new CustomerVehicle($this->db);
        $vehicles = $vehicleModel->getByCustomer($customer_id);

        echo json_encode([
            'success' => true,
            'vehicles' => $vehicles
        ]);
    }

    public function handleAddVehicle($payload) {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            http_response_code(405);
            echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
            return;
        }

        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input) $input = $_POST;

        $required = ['vehicle_category_id', 'brand', 'color'];
        foreach ($required as $field) {
            if (empty($input[$field])) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => "Missing field: $field"]);
                return;
            }
        }

        $customer_id = $payload['user_id'];
        $vehicleModel = new CustomerVehicle($this->db);

        // Optional: Check if already exists to prevent duplicates
        if ($vehicleModel->exists($customer_id, $input['brand'], $input['color'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Vehicle already exists in your garage.']);
            return;
        }

        $data = [
            'customer_id' => $customer_id,
            'vehicle_category_id' => $input['vehicle_category_id'],
            'brand' => $input['brand'],
            'color' => $input['color']
        ];

        $vehicleId = $vehicleModel->add($data);

        if ($vehicleId) {
            echo json_encode(['success' => true, 'message' => 'Vehicle added successfully', 'id' => $vehicleId]);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Failed to add vehicle.']);
        }
    }

    public function handleUpdateVehicle($payload) {
        if ($_SERVER['REQUEST_METHOD'] !== 'PUT' && $_SERVER['REQUEST_METHOD'] !== 'POST') {
            http_response_code(405);
            echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
            return;
        }

        $input = json_decode(file_get_contents('php://input'), true);
        
        $required = ['id', 'vehicle_category_id', 'brand', 'color'];
        foreach ($required as $field) {
            if (empty($input[$field])) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => "Missing field: $field"]);
                return;
            }
        }

        $customer_id = $payload['user_id'];
        $vehicleModel = new CustomerVehicle($this->db);
        
        $data = [
            'vehicle_category_id' => $input['vehicle_category_id'],
            'brand' => $input['brand'],
            'color' => $input['color']
        ];

        if ($vehicleModel->update($input['id'], $customer_id, $data)) {
            echo json_encode(['success' => true, 'message' => 'Vehicle updated successfully']);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Failed to update vehicle.']);
        }
    }

    public function handleDeleteVehicle($payload) {
        if ($_SERVER['REQUEST_METHOD'] !== 'DELETE' && $_SERVER['REQUEST_METHOD'] !== 'POST') {
            http_response_code(405);
            echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
            return;
        }

        $input = json_decode(file_get_contents('php://input'), true);
        $vehicle_id = $input['id'] ?? null;
        
        if (isset($_GET['id'])) {
            $vehicle_id = $_GET['id'];
        }

        if (!$vehicle_id) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Missing vehicle ID.']);
            return;
        }

        $customer_id = $payload['user_id'];
        $vehicleModel = new CustomerVehicle($this->db);
        
        if ($vehicleModel->delete($vehicle_id, $customer_id)) {
            echo json_encode(['success' => true, 'message' => 'Vehicle deleted successfully']);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Failed to delete vehicle.']);
        }
    }
}