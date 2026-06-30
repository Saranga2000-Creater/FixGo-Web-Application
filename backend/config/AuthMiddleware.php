<?php

require_once __DIR__ . '/JwtHandler.php';

class AuthMiddleware
{
    public static function authenticate()
    {
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? '';

        if (!preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            http_response_code(401);
            echo json_encode([
                "success" => false,
                "message" => "Authorization token missing."
            ]);
            exit();
        }

        $jwtHandler = new JwtHandler();
        $payload = $jwtHandler->decode($matches[1]);

        if ($payload === false) {
            http_response_code(401);
            echo json_encode([
                "success" => false,
                "message" => "Invalid or expired token."
            ]);
            exit();
        }

        return $payload;
    }
}