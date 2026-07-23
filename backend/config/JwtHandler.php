<?php
class JwtHandler {
    private $secretKey;

    public function __construct() {
        $secretKey = $_ENV['JWT_SECRET'] ?? getenv('JWT_SECRET');
        $secretKey = is_string($secretKey) ? trim($secretKey) : '';

        if ($secretKey === '') {
            throw new RuntimeException('JWT_SECRET environment variable is required.');
        }

        $this->secretKey = $secretKey;
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

    // ADDED: The method to verify and decode incoming tokens
    public function decode($token) {
        // 1. Split the token into its three parts
        $parts = explode('.', $token);
        if (count($parts) !== 3) {
            return false; // Malformed token
        }

        list($header_encoded, $payload_encoded, $signature_encoded) = $parts;

        // 2. Recreate the signature using our secret key to ensure it hasn't been tampered with
        $valid_signature = hash_hmac('sha256', "$header_encoded.$payload_encoded", $this->secretKey, true);
        $valid_signature_encoded = $this->base64UrlEncode($valid_signature);

        // Security best practice: Use hash_equals to prevent timing attacks
        if (!hash_equals($valid_signature_encoded, $signature_encoded)) {
            return false; // Signature is invalid
        }

        // 3. Decode the payload
        // We have to reverse the Base64Url encoding back to standard Base64 first
        $payload_json = base64_decode(str_replace(['-', '_'], ['+', '/'], $payload_encoded));
        $payload = json_decode($payload_json, true);

        // 4. Check if the token has expired
        if (isset($payload['exp']) && $payload['exp'] < time()) {
            return false; // Token has expired
        }

        // Token is valid! Return the payload data (like user ID)
        return $payload;
    }
}