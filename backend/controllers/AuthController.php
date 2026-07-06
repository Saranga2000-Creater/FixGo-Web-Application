<?php

require_once __DIR__ . '/../models/userRole.php';
require_once __DIR__ . '/../config/JwtHandler.php';


class AuthController{

    private $db;
    public function __construct($dbconnection){
        $this->db = $dbconnection;
    }

    public function login(){

        $data = json_decode(file_get_contents("php://input"));
        
        if(empty($data->email)||empty($data->password)){
            http_response_code(400);
            echo json_encode(["message"=>"Email and password are required."]);
            return;
        }

        $user = new User($this->db);
        
        if($user->findByEmail($data->email)){
            
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

            $isPasswordValid = ($data->password === $user->password)||password_verify($data->password, $user->password);

            if($isPasswordValid){

                $jwtHandler = new JwtHandler();
                
                $tokenPayload = [
                    "user_id" => $user-> id,
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

            http_response_code(401);
            echo json_encode(["message"=>"Invalid email or password."]);
        } else {
            http_response_code(401);
            echo json_encode(["message"=>"Invalid email or password."]);
        }
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
            echo json_encode(["message" => "Verification token is required."]);
            return;
        }

        try {
            $user = new User($this->db);

            if (!$user->findByVerificationToken($token)) {
                http_response_code(400);
                echo json_encode(["message" => "Invalid or expired verification token."]);
                return;
            }

            if($user->token_expiry && strtotime($user->token_expiry)<time()){
                http_response_code(400);
                echo json_encode(["message" => "Verification link has expired. Please try again later." ]);
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