<?php
require_once __DIR__ . '/config/bootstrap.php';
require_once __DIR__ . '/models/Shop.php';

$database = new Database();
$db = $database->connect();
$qb = new QueryBuilder($db);

$shop = new Shop($db, $qb);
$stmt = $shop->findNearby(6.9271, 79.8612, 15, null, null, 'distance', null, 'false', 'all', '12:00:00');

$results = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode([
    'count' => count($results),
    'results' => $results
], JSON_PRETTY_PRINT);
?>
