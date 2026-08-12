<?php
require_once __DIR__ . '/database/QueryBuilder.php';

// Mock PDO class for testing without executing queries
class MockPDO {
    public function prepare($sql) {
        echo "[Mock PDO] prepare called with:\n  $sql\n";
        return new MockStatement();
    }
    public function lastInsertId() {
        return 999;
    }
}

class MockStatement {
    private $bindings = [];
    public function bindValue($param, $value, $type) {
        $this->bindings[$param] = $value;
    }
    public function execute() {
        echo "[Mock Statement] execute called with bindings:\n";
        foreach ($this->bindings as $k => $v) {
            echo "  $k => $v\n";
        }
    }
    public function fetchAll($mode) { return []; }
    public function fetch($mode) { return []; }
    public function fetchColumn() { return 0; }
}

$db = new MockPDO();
$qb = new QueryBuilder($db);

echo "====================\n";
echo "TEST 1: Basic Select\n";
echo "====================\n";
$qb->table('users')->where('status', 'active')->get();

echo "\n====================\n";
echo "TEST 2: Complex JOIN and GIS (Shop::findNearby)\n";
echo "====================\n";
$qb->table('shop', 's')
   ->select([
       's.id', 's.name', 
       'ST_Distance_Sphere(s.location, POINT(:lng, :lat)) AS distance'
   ])
   ->leftJoin('shopCategoryMapping scm', 's.id', '=', 'scm.shop_id')
   ->where('s.carriageService', 1)
   ->whereRaw('ST_Distance_Sphere(s.location, POINT(:lng, :lat)) <= :radius', [
       'lat' => 6.9, 
       'lng' => 79.8, 
       'radius' => 5000
   ])
   ->whereIn('scm.shop_category_id', [1, 2, 3])
   ->orderByRaw('distance ASC')
   ->get();

echo "\n====================\n";
echo "TEST 3: Insert\n";
echo "====================\n";
$id = $qb->table('users')->insertGetId(['email' => 'test@example.com', 'isActive' => 1]);
echo "Returned ID: $id\n";

echo "\n====================\n";
echo "TEST 4: Update with Raw Expression\n";
echo "====================\n";
$qb->table('customer')
   ->where('id', 42)
   ->update([
       'name' => 'John Doe',
       'cancellation_strikes' => QueryBuilder::raw('cancellation_strikes + 1')
   ]);

echo "\nTests Complete.\n";
