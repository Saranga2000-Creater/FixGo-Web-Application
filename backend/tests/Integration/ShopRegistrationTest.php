<?php
use PHPUnit\Framework\TestCase;

require_once __DIR__ . '/../../config/Database.php';
require_once __DIR__ . '/../../database/QueryBuilder.php';

class ShopRegistrationTest extends TestCase {
    private $db;
    private $qb;
    private $testEmail = 'shop_reg_test@fixgo.com';
    private $wrapperPath;
    private $initialFiles = [];
    private $initialDocFiles = [];

    protected function setUp(): void {
        putenv('JWT_SECRET=supersecret1234567890abcdef');
        
        $database = new Database();
        $this->db = $database->connect();
        $this->qb = new QueryBuilder($this->db);
        
        // Clean up test DB before start
        $user = $this->qb->table('users')->where('email', $this->testEmail)->first();
        if ($user) {
            $shop = $this->qb->table('shop')->where('id', $user['id'])->first();
            if ($shop) {
                $this->qb->table('shopcategorymapping')->where('shop_id', $shop['id'])->delete();
                $this->qb->table('shopvehiclecategories')->where('shop_id', $shop['id'])->delete();
                $this->qb->table('shopimage')->where('shop_id', $shop['id'])->delete();
            }
            $this->qb->table('shop')->where('id', $user['id'])->delete();
            $this->qb->table('users')->where('id', $user['id'])->delete();
        }

        // Snapshot files before tests run
        $this->initialFiles = glob(realpath(__DIR__ . '/../../') . '/uploads/shopOwners/*');
        $this->initialDocFiles = glob(realpath(__DIR__ . '/../../') . '/uploads/verificationDocs/*') ?: [];

        $this->wrapperPath = __DIR__ . '/shop_reg_wrapper.php';
        file_put_contents($this->wrapperPath, "<?php
            require_once '" . realpath(__DIR__ . '/../../config/Database.php') . "';
            require_once '" . realpath(__DIR__ . '/../../controllers/ShopController.php') . "';
            require_once '" . realpath(__DIR__ . '/../../config/RequestValidator.php') . "';
            require_once '" . realpath(__DIR__ . '/../../database/QueryBuilder.php') . "';
            require_once '" . realpath(__DIR__ . '/../../models/Category.php') . "';
            \$db = (new Database())->connect();
            \$controller = new ShopController(\$db);
            \$controller->register();
        ");
    }

    protected function tearDown(): void {
        $user = $this->qb->table('users')->where('email', $this->testEmail)->first();
        if ($user) {
            $shop = $this->qb->table('shop')->where('id', $user['id'])->first();
            if ($shop) {
                $this->qb->table('shopcategorymapping')->where('shop_id', $shop['id'])->delete();
                $this->qb->table('shopvehiclecategories')->where('shop_id', $shop['id'])->delete();
                $this->qb->table('shopimage')->where('shop_id', $shop['id'])->delete();
            }
            $this->qb->table('shop')->where('id', $user['id'])->delete();
            $this->qb->table('users')->where('id', $user['id'])->delete();
        }
        
        // Clean up orphaned files
        $currentFiles = glob(realpath(__DIR__ . '/../../') . '/uploads/shopOwners/*');
        $newFiles = array_diff($currentFiles, $this->initialFiles);
        foreach ($newFiles as $file) {
            if (is_file($file)) {
                @unlink($file);
            }
        }
        $currentDocFiles = glob(realpath(__DIR__ . '/../../') . '/uploads/verificationDocs/*') ?: [];
        $newDocFiles = array_diff($currentDocFiles, $this->initialDocFiles);
        foreach ($newDocFiles as $file) {
            if (is_file($file)) {
                @unlink($file);
            }
        }
        if (file_exists($this->wrapperPath)) {
            @unlink($this->wrapperPath);
        }
    }

    private function runRegistrationRequest($payload) {
        $boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
        $body = '';
        
        foreach ($payload as $name => $value) {
            if (is_array($value)) {
                foreach ($value as $v) {
                    $body .= "--{$boundary}\r\n";
                    $body .= "Content-Disposition: form-data; name=\"{$name}[]\"\r\n\r\n";
                    $body .= "{$v}\r\n";
                }
            } else {
                $body .= "--{$boundary}\r\n";
                $body .= "Content-Disposition: form-data; name=\"{$name}\"\r\n\r\n";
                $body .= "{$value}\r\n";
            }
        }
        
        // Add valid 1x1 JPEG image
        $jpegBase64 = '/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=';
        $jpegBinary = base64_decode($jpegBase64);
        
        $body .= "--{$boundary}\r\n";
        $body .= "Content-Disposition: form-data; name=\"shopImage\"; filename=\"test_shop.jpg\"\r\n";
        $body .= "Content-Type: image/jpeg\r\n\r\n";
        $body .= "{$jpegBinary}\r\n";

        // Add verification doc file (dummy PDF)
        $body .= "--{$boundary}\r\n";
        $body .= "Content-Disposition: form-data; name=\"verificationDoc\"; filename=\"test_verify.pdf\"\r\n";
        $body .= "Content-Type: application/pdf\r\n\r\n";
        $body .= "%PDF-1.4 test pdf content\r\n";
        
        $body .= "--{$boundary}--\r\n";

        $contentLength = strlen($body);
        
        $descriptorspec = [
            0 => ["pipe", "r"], // stdin is a pipe that the child will read from
            1 => ["pipe", "w"], // stdout is a pipe that the child will write to
            2 => ["pipe", "w"]  // stderr
        ];
        
        $env = [
            'SCRIPT_FILENAME' => $this->wrapperPath,
            'REDIRECT_STATUS' => '1',
            'REQUEST_METHOD' => 'POST',
            'CONTENT_TYPE' => "multipart/form-data; boundary={$boundary}",
            'CONTENT_LENGTH' => (string)$contentLength,
            'JWT_SECRET' => 'supersecret1234567890abcdef'
        ];
        
        if (getenv('SystemRoot')) $env['SystemRoot'] = getenv('SystemRoot');
        if (getenv('PATH')) $env['PATH'] = getenv('PATH');
        
        foreach ($_ENV as $k => $v) {
            if (is_string($v)) $env[$k] = $v;
        }
        foreach ($_SERVER as $k => $v) {
            if (is_string($v) && !isset($env[$k])) $env[$k] = $v;
        }

        $process = proc_open('php-cgi', $descriptorspec, $pipes, null, $env);
        
        $output = '';
        if (is_resource($process)) {
            fwrite($pipes[0], $body);
            fclose($pipes[0]);
            
            $output = stream_get_contents($pipes[1]);
            fclose($pipes[1]);
            fclose($pipes[2]);
            
            proc_close($process);
        }
        
        if (preg_match('/Status: (\d+)/i', $output, $matches)) {
            $status = (int)$matches[1];
        } else {
            $status = 200;
        }
        
        $body = '';
        $parts = explode("\r\n\r\n", $output, 2);
        if (count($parts) === 2) {
            $body = $parts[1];
        } else {
            $parts = explode("\n\n", $output, 2);
            if (count($parts) === 2) {
                $body = $parts[1];
            }
        }
        
        return [
            'status' => $status,
            'body' => json_decode($body, true) ?: $body
        ];
    }

    private function getValidPayload() {
        return [
            'ownerName' => 'Jane Smith',
            'shopName' => 'FixGo Auto Repair',
            'email' => $this->testEmail,
            'phone' => '0771234568',
            'address' => '456 Garage Ave, Colombo',
            'openTime' => '08:00',
            'closeTime' => '18:00',
            'providesCarriage' => 0,
            'category' => 'Garages',
            'vehicleCategory' => ['4 Wheelers'],
            'description' => 'Best repairs in town',
            'latitude' => 6.9271,
            'longitude' => 79.8612,
            'password' => 'StrongPassword123'
        ];
    }

    public function testSuccessfulShopRegistration() {
        $payload = $this->getValidPayload();
        
        $response = $this->runRegistrationRequest($payload);
        
        $this->assertEquals(201, $response['status']);
        $this->assertStringContainsString('Shop owner registered successfully', $response['body']['message'] ?? '');
        
        // Verify in DB
        $user = $this->qb->table('users')->where('email', $this->testEmail)->first();
        $this->assertNotEmpty($user);
        $this->assertEquals('shop_owner', $user['userRole']);
        $this->assertEquals(0, $user['isActive']); // Shop owners require admin approval
        
        $shop = $this->qb->table('shop')->where('id', $user['id'])->first();
        $this->assertNotEmpty($shop);
        $this->assertEquals('FixGo Auto Repair', $shop['name']);
    }

    public function testDuplicateEmailRejected() {
        $payload = $this->getValidPayload();
        $this->runRegistrationRequest($payload); // First works
        
        // Mark user as verified to trigger duplicate email rejection
        $this->qb->table('users')->where('email', $this->testEmail)->update(['is_email_verified' => 1]);
        
        $response = $this->runRegistrationRequest($payload); // Second fails
        $this->assertEquals(400, $response['status']);
        $this->assertStringContainsString('already registered', $response['body']['message'] ?? '');
    }

    public function testInvalidCategoryRejected() {
        $payload = $this->getValidPayload();
        $payload['category'] = 'FakeCategory';
        
        $response = $this->runRegistrationRequest($payload);
        $this->assertEquals(400, $response['status']);
        $this->assertStringContainsString('Invalid workshop category', $response['body']['message'] ?? '');
    }

    public function testTowingFieldsRequiredWhenCarriageEnabled() {
        $payload = $this->getValidPayload();
        $payload['providesCarriage'] = 1;
        // Missing truck details
        
        $response = $this->runRegistrationRequest($payload);
        $this->assertEquals(400, $response['status']);
        $this->assertStringContainsString('Missing required towing field', $response['body']['message'] ?? '');
    }

    public function testInvalidLicensePlateRejected() {
        $payload = $this->getValidPayload();
        $payload['providesCarriage'] = 1;
        $payload['defaultDriverName'] = 'Test Driver';
        $payload['defaultDriverPhone'] = '0770000000';
        $payload['defaultTruckBrand'] = 'Isuzu';
        $payload['defaultTruckColor'] = 'White';
        $payload['towTruckPlate'] = 'XXXXXX'; // Invalid format
        
        $response = $this->runRegistrationRequest($payload);
        $this->assertEquals(400, $response['status']);
        $this->assertStringContainsString('valid vehicle plate', $response['body']['message'] ?? '');
    }
}
