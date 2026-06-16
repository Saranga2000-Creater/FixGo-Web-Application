<?php

ini_set('display_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once __DIR__ . '/../config/EnvLoader.php';
EnvLoader::load(__DIR__ . '/../.env');

require_once __DIR__ . '/../config/Database.php';

if (!isset($_GET['shopId'])) {
    echo json_encode([
        "message" => "shopId required"
    ]);
    exit;
}

$shopId = $_GET['shopId'];

$db = (new Database())->connect();

$query = "
SELECT
    u.id,
    u.email,

    s.name,
    s.owner,
    s.address,
    s.contactNumber,
    s.description,
    s.openTime,
    s.closeTime,
    s.carriageService,
    s.BRN,
    s.profileImageURL,

    sc.name AS category

FROM users u

INNER JOIN shop s
ON u.id = s.id

LEFT JOIN shopcategorymapping scm
ON scm.shop_id = s.id

LEFT JOIN shopcategory sc
ON sc.id = scm.shop_category_id

WHERE u.id = :id
";

$stmt = $db->prepare($query);

$stmt->execute([
    ':id' => $shopId
]);

echo json_encode(
    $stmt->fetch(PDO::FETCH_ASSOC)
);