<?php

require_once __DIR__ . '/../models/userRole.php';
require_once __DIR__ . '/../config/JwtHandler.php';


class AuthController{

    private $db;
    private $rateLimitFile;

    public function __construct($dbconnection){
        $this->db = $dbconnection;
        $this->rateLimitFile = __DIR__ . '/../uploads/login_attempts.json';
    }

    public function login(){

        $rawInput = file_get_contents("php://input");
        $data = json_decode($rawInput);
        
        if(!is_object($data) || empty($data->email) || empty($data->password)){
            http_response_code(400);
            echo json_encode(["message"=>"Email and password are required."]);
            return;
        }

        $email = trim($data->email);
        $password = $data->password;

        if ($this->isRateLimited($email)) {
            http_response_code(429);
            echo json_encode(["message"=>"Too many login attempts. Please try again later."]);
            return;
        }

        $user = new User($this->db);
        
        if($user->findByEmail($email)){
            
            if(!$user->is_email_verified){
                http_response_code(403);
                echo json_encode(["message"=>"Please verify your email address before logging in."]);
                return;
            }
            
            if(!$user->isActive){

                http_response_code(403);
                echo json_encode(["message"=>"Account is inactive. Please contact support."]);
                return;
            }

            $isPasswordValid = password_verify($password, $user->password);

            if($isPasswordValid){
                $this->clearRateLimit($email);

                try {
                    $jwtHandler = new JwtHandler();
                } catch (RuntimeException $e) {
                    http_response_code(500);
                    echo json_encode(["message"=>"Server authentication configuration error."]);
                    return;
                }
                
                $tokenPayload = [
                    "user_id" => $user->id,
                    "email" => $user->email,
                    "role" => $user->userRole
                ];

                $jwt = $jwtHandler->generate($tokenPayload);

                // Fetch profile image URL
                $profileImage = null;
                if ($user->userRole === 'shop_owner') {
                    $stmt = $this->db->prepare("SELECT profileImageURL FROM shop WHERE id = :id LIMIT 1");
                    $stmt->execute([':id' => $user->id]);
                    if ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                        $profileImage = $row['profileImageURL'];
                    }
                } else if ($user->userRole === 'customer') {
                    $stmt = $this->db->prepare("SELECT profilePhoto FROM customer WHERE id = :id LIMIT 1");
                    $stmt->execute([':id' => $user->id]);
                    if ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                        $profileImage = $row['profilePhoto'];
                    }
                }

                http_response_code(200);

                echo json_encode([
                    "message" => "Login successful.",
                    "token" => $jwt,
                    "role" => $user->userRole,
                    "id" => $user->id,
                    "profileImage" => $profileImage
                ]);

                return;

            }

            $this->recordFailedAttempt($email);

            http_response_code(401);
            echo json_encode(["message"=>"Invalid email or password."]);
        } else {
            $this->recordFailedAttempt($email);
            http_response_code(401);
            echo json_encode(["message"=>"Invalid email or password."]);
        }
    }

    private function getRateLimitKey($email) {
        $ip = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? 'unknown';
        $ip = preg_replace('/[^a-zA-Z0-9._:-]/', '', $ip);
        return hash('sha256', strtolower(trim($email)) . ':' . $ip);
    }

    private function loadRateLimitData() {
        if (!file_exists($this->rateLimitFile)) {
            return [];
        }

        $contents = @file_get_contents($this->rateLimitFile);
        if ($contents === false) {
            return [];
        }

        $decoded = json_decode($contents, true);
        return is_array($decoded) ? $decoded : [];
    }

    private function saveRateLimitData($data) {
        $directory = dirname($this->rateLimitFile);
        if (!is_dir($directory)) {
            mkdir($directory, 0755, true);
        }

        file_put_contents($this->rateLimitFile, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES), LOCK_EX);
    }

    private function isRateLimited($email) {
        $data = $this->loadRateLimitData();
        $key = $this->getRateLimitKey($email);

        if (!isset($data[$key])) {
            return false;
        }

        $entry = $data[$key];
        $now = time();

        if (($entry['blocked_until'] ?? 0) > $now) {
            return true;
        }

        if (($entry['last_attempt'] ?? 0) + 900 < $now) {
            unset($data[$key]);
            $this->saveRateLimitData($data);
            return false;
        }

        return ($entry['attempts'] ?? 0) >= 5;
    }

    private function recordFailedAttempt($email) {
        $data = $this->loadRateLimitData();
        $key = $this->getRateLimitKey($email);
        $now = time();

        if (!isset($data[$key]) || ($data[$key]['last_attempt'] ?? 0) + 900 < $now) {
            $data[$key] = [
                'attempts' => 1,
                'last_attempt' => $now,
                'blocked_until' => 0
            ];
        } else {
            $data[$key]['attempts'] = ($data[$key]['attempts'] ?? 0) + 1;
            $data[$key]['last_attempt'] = $now;

            if (($data[$key]['attempts'] ?? 0) >= 5) {
                $data[$key]['blocked_until'] = $now + 900;
            }
        }

        $this->saveRateLimitData($data);
    }

    private function clearRateLimit($email) {
        $data = $this->loadRateLimitData();
        $key = $this->getRateLimitKey($email);
        unset($data[$key]);
        $this->saveRateLimitData($data);
    }

    public function verifyEmail() {
        // Only handle POST and GET requests
        if ($_SERVER['REQUEST_METHOD'] !== 'POST' && $_SERVER['REQUEST_METHOD'] !== 'GET') {
            http_response_code(405);
            echo json_encode(["message" => "Method not allowed."]);
            return;
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
            echo json_encode(["message" => "OTP is required."]);
            return;
        }

        try {
            $user = new User($this->db);

            if (!$user->findByVerificationToken($token)) {
                http_response_code(400);
                echo json_encode(["message" => "Invalid OTP. Please check the code sent to your email."]);
                return;
            }

            if($user->token_expiry && strtotime($user->token_expiry)<time()){
                http_response_code(400);
                echo json_encode(["message" => "Verification OTP has expired. Please try again later." ]);
                return;
            }

            $user->verifyEmail($user->id);

            http_response_code(200);
            echo json_encode(["message" => "Email verified successfully. You can now log in to your account."]);
            return;
    
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["message" => "Verification failed: " . $e->getMessage()]);
            return;
        }
    }

}