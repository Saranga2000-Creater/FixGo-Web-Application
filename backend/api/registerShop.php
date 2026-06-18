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

// Only handle POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["message" => "Method not allowed."]);
    exit();
}

// Check inputs in $_POST
$requiredFields = [
    'ownerName', 'shopName', 'email', 'phone', 'address',
    'openTime', 'closeTime', 'providesCarriage',
    'category', 'vehicleCategory', 'description', 'latitude', 'longitude', 'password'
];

foreach ($requiredFields as $field) {
    if (!isset($_POST[$field]) || trim($_POST[$field]) === '') {
        http_response_code(400);
        echo json_encode(["message" => "Missing required field: $field"]);
        exit();
    }
}

$ownerName = trim($_POST['ownerName']);
$shopName = trim($_POST['shopName']);
$email = trim($_POST['email']);
$phone = trim($_POST['phone']);
$address = trim($_POST['address']);
$licenseNumber = isset($_POST['licenseNumber']) ? trim($_POST['licenseNumber']) : '';
$openTime = trim($_POST['openTime']);
$closeTime = trim($_POST['closeTime']);
$providesCarriage = (int)$_POST['providesCarriage'];
$category = trim($_POST['category']);
$vehicleCategory = trim($_POST['vehicleCategory']);
$description = trim($_POST['description']);
$latitude = (float)$_POST['latitude'];
$longitude = (float)$_POST['longitude'];
$password = $_POST['password'];

$defaultDriverName = '';
$defaultDriverPhone = '';
$defaultTruckBrand = '';
$defaultTruckColor = '';
$towTruckPlate = '';

if ($providesCarriage === 1) {
    $towFields = ['defaultDriverName', 'defaultDriverPhone', 'defaultTruckBrand', 'defaultTruckColor', 'towTruckPlate'];
    foreach ($towFields as $tf) {
        if (!isset($_POST[$tf]) || trim($_POST[$tf]) === '') {
            http_response_code(400);
            echo json_encode(["message" => "Missing required towing field: $tf"]);
            exit();
        }
    }
    $defaultDriverName = trim($_POST['defaultDriverName']);
    $defaultDriverPhone = trim($_POST['defaultDriverPhone']);
    $defaultTruckBrand = trim($_POST['defaultTruckBrand']);
    $defaultTruckColor = trim($_POST['defaultTruckColor']);
    $towTruckPlate = trim($_POST['towTruckPlate']);
}

// Validate profile photo
if (!isset($_FILES['shopImage']) || $_FILES['shopImage']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(["message" => "Please upload a workshop photo."]);
    exit();
}

$file = $_FILES['shopImage'];
$fileSize = $file['size'];
$fileTmp = $file['tmp_name'];
$fileName = $file['name'];

// Check file size (5MB max)
if ($fileSize > 5 * 1024 * 1024) {
    http_response_code(400);
    echo json_encode(["message" => "Workshop photo must be under 5MB."]);
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

// Create uploads/shopOwners folder if not exists
$targetDir = __DIR__ . '/../uploads/shopOwners/';
if (!file_exists($targetDir)) {
    mkdir($targetDir, 0777, true);
}

// Generate a unique file name
$uniqueFileName = uniqid('shop_', true) . '.' . $fileExtension;
$targetFilePath = $targetDir . $uniqueFileName;
$dbImagePath = 'uploads/shopOwners/' . $uniqueFileName;

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

// Map Shop Category
$categoryId = null;
if (strcasecmp($category, 'Garages') === 0) {
    $categoryId = 1;
} elseif (strcasecmp($category, 'Service centers') === 0 || strcasecmp($category, 'Service Centers') === 0) {
    $categoryId = 2;
} elseif (strcasecmp($category, 'Spare parts') === 0 || strcasecmp($category, 'Spare Parts') === 0) {
    $categoryId = 3;
}

if ($categoryId === null) {
    http_response_code(400);
    echo json_encode(["message" => "Invalid workshop category: $category"]);
    exit();
}

// Map Vehicle Category
$vehicleIds = [];
if (strcasecmp($vehicleCategory, '3 wheelers and bikes') === 0 || strcasecmp($vehicleCategory, '3 Wheelers & Bikes') === 0) {
    $vehicleIds = [1];
} elseif (strcasecmp($vehicleCategory, '4 wheelers') === 0 || strcasecmp($vehicleCategory, '4 Wheelers') === 0) {
    $vehicleIds = [2];
} elseif (strcasecmp($vehicleCategory, 'commercial vehicles') === 0 || strcasecmp($vehicleCategory, 'Commercial Vehicles') === 0) {
    $vehicleIds = [3];
}

if (empty($vehicleIds)) {
    http_response_code(400);
    echo json_encode(["message" => "Invalid vehicle category: $vehicleCategory"]);
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

    // 1. Insert into users
    $userQuery = "INSERT INTO users (email, userRole, password, isActive) VALUES (:email, 'shop_owner', :password, 1)";
    $userStmt = $db->prepare($userQuery);
    $userStmt->execute([
        ':email' => $email,
        ':password' => $passwordHash
    ]);
    
    $userId = $db->lastInsertId();

    // 2. Insert into shop
    $shopQuery = "INSERT INTO shop (id, name, address, contactNumber, owner, location, description, openTime, closeTime, isAvailable, carriageService, BRN, profileImageURL, default_driver_name, default_driver_phone, default_truck_brand, default_truck_color, tow_truck_plate) 
                  VALUES (:id, :name, :address, :contactNumber, :owner, ST_GeomFromText(:location_point), :description, :openTime, :closeTime, 1, :carriageService, :BRN, :profileImageURL, :driverName, :driverPhone, :truckBrand, :truckColor, :truckPlate)";
    
    $shopStmt = $db->prepare($shopQuery);
    $shopStmt->execute([
        ':id' => $userId,
        ':name' => $shopName,
        ':address' => $address,
        ':contactNumber' => $phone,
        ':owner' => $ownerName,
        ':location_point' => "POINT($longitude $latitude)",
        ':description' => $description,
        ':openTime' => $openTime,
        ':closeTime' => $closeTime,
        ':carriageService' => $providesCarriage,
        ':BRN' => $licenseNumber,
        ':profileImageURL' => $dbImagePath,
        ':driverName' => $defaultDriverName,
        ':driverPhone' => $defaultDriverPhone,
        ':truckBrand' => $defaultTruckBrand,
        ':truckColor' => $defaultTruckColor,
        ':truckPlate' => $towTruckPlate
    ]);

    // 3. Insert into shopcategorymapping
    $mappingQuery = "INSERT INTO shopCategoryMapping (shop_id, shop_category_id) VALUES (:shop_id, :shop_category_id)";
    $mappingStmt = $db->prepare($mappingQuery);
    $mappingStmt->execute([
        ':shop_id' => $userId,
        ':shop_category_id' => $categoryId
    ]);

    // 4. Insert into shopvehiclecategories
    $vehicleQuery = "INSERT INTO shopVehicleCategories (shop_id, vehicle_category_id) VALUES (:shop_id, :vehicle_category_id)";
    $vehicleStmt = $db->prepare($vehicleQuery);
    foreach ($vehicleIds as $vId) {
        $vehicleStmt->execute([
            ':shop_id' => $userId,
            ':vehicle_category_id' => $vId
        ]);
    }

    $db->commit();
    
    http_response_code(201);
    echo json_encode(["message" => "Shop owner registered successfully."]);

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
