<?php
class JWT {
    private static $secret = 'your_secret_key_fixgo_2024_change_this';
    private static $algorithm = 'HS256';

    public static function createToken($user) {
        $header = [
            'alg' => self::$algorithm,
            'typ' => 'JWT'
        ];

        $payload = [
            'id' => $user['id'],
            'email' => $user['email'],
            'username' => $user['username'],
            'role' => $user['role'],
            'iat' => time(),
            'exp' => time() + (60 * 60 * 24) // 24 hours
        ];

        $headerEncoded = self::base64UrlEncode(json_encode($header));
        $payloadEncoded = self::base64UrlEncode(json_encode($payload));
        $signature = hash_hmac('sha256', $headerEncoded . '.' . $payloadEncoded, self::$secret, true);
        $signatureEncoded = self::base64UrlEncode($signature);

        return $headerEncoded . '.' . $payloadEncoded . '.' . $signatureEncoded;
    }

    public static function verifyToken($token) {
        $parts = explode('.', $token);
        
        if (count($parts) != 3) {
            return false;
        }

        $headerEncoded = $parts[0];
        $payloadEncoded = $parts[1];
        $signatureEncoded = $parts[2];

        $signature = hash_hmac('sha256', $headerEncoded . '.' . $payloadEncoded, self::$secret, true);
        $expectedSignature = self::base64UrlEncode($signature);

        if ($signatureEncoded !== $expectedSignature) {
            return false;
        }

        $payload = json_decode(self::base64UrlDecode($payloadEncoded), true);

        if ($payload['exp'] < time()) {
            return false;
        }

        return $payload;
    }

    private static function base64UrlEncode($data) {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    private static function base64UrlDecode($data) {
        return base64_decode(strtr($data, '-_', '+/') . str_repeat('=', 4 - strlen($data) % 4));
    }
}
?>
