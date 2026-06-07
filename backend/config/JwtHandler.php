<?php
class JwtHandler {
    private $secretKey;

    public function __construct() {
        $this->secretKey = $_ENV['JWT_SECRET'] ?? 'fallback_secret_key_123456';
    }

    // Base64Url Encoding helper
    private function base64UrlEncode($text) {
        return str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($text));
    }

    // Generate JWT Token
    public function generate($payload) {
        $headers = ['alg' => 'HS256', 'typ' => 'JWT'];
        $headers_encoded = $this->base64UrlEncode(json_encode($headers));
        
        // Append expiration time (e.g., 2 hours) to payload
        $payload['iat'] = time();
        $payload['exp'] = time() + (2 * 60 * 60); 
        $payload_encoded = $this->base64UrlEncode(json_encode($payload));
        
        // Build signature
        $signature = hash_hmac('sha256', "$headers_encoded.$payload_encoded", $this->secretKey, true);
        $signature_encoded = $this->base64UrlEncode($signature);
        
        return "$headers_encoded.$payload_encoded.$signature_encoded";
    }
}