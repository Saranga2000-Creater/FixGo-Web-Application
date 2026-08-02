<?php

require_once __DIR__ . '/../config/bootstrap.php';

// Authenticate and restrict to admin only
$payload = AuthMiddleware::authenticate();
$role = $payload['role'] ?? $payload['userRole'] ?? '';
if ($role !== 'admin') {
    http_response_code(403);
    echo json_encode(["success" => false, "message" => "Unauthorized access. Admin privileges required."]);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed."]);
    exit();
}

$database = new Database();
$db = $database->connect();

// Fetch all shop_owner accounts that have verified their email but are awaiting admin approval
$query = "SELECT 
              u.id,
              u.email,
              u.is_email_verified,
              s.name        AS shopName,
              s.owner       AS ownerName,
              s.address,
              s.contactNumber,
              s.description,
              s.openTime,
              s.closeTime,
              s.carriageService,
              s.BRN,
              s.profileImageURL,
              GROUP_CONCAT(DISTINCT sc.name  SEPARATOR ', ') AS category,
              GROUP_CONCAT(DISTINCT vc.name  SEPARATOR ', ') AS vehicleCategories
          FROM users u
          INNER JOIN shop s            ON s.id  = u.id
          LEFT JOIN shopCategoryMapping scm ON scm.shop_id = s.id
          LEFT JOIN shopCategory sc    ON sc.id  = scm.shop_category_id
          LEFT JOIN shopVehicleCategories svc ON svc.shop_id = s.id
          LEFT JOIN vehicleCategory vc ON vc.id  = svc.vehicle_category_id
          WHERE u.userRole = 'shop_owner'
            AND u.is_email_verified = 1
            AND u.isActive = 0
          GROUP BY u.id, s.name, s.owner, s.address, s.contactNumber,
                   s.description, s.openTime, s.closeTime, s.carriageService,
                   s.BRN, s.profileImageURL
          ORDER BY u.id DESC";

$stmt = $db->prepare($query);
$stmt->execute();
$shops = $stmt->fetchAll(PDO::FETCH_ASSOC);

http_response_code(200);
echo json_encode(["success" => true, "data" => $shops]);
