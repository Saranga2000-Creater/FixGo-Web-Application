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
        }
    }

}