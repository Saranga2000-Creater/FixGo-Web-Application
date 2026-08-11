<?php

class RequestValidator {
    /**
     * Enforces the required HTTP method.
     * Halts execution with a 405 response if invalid.
     *
     * @param string|array $allowedMethods e.g., 'POST' or ['POST', 'PUT']
     */
    public static function enforceMethod($allowedMethods) {
        $method = $_SERVER['REQUEST_METHOD'];
        
        if (is_array($allowedMethods)) {
            if (!in_array($method, $allowedMethods)) {
                http_response_code(405);
                echo json_encode([
                    "success" => false, 
                    "message" => "Method not allowed. Expected one of: " . implode(', ', $allowedMethods) . "."
                ]);
                exit();
            }
        } else {
            if ($method !== $allowedMethods) {
                http_response_code(405);
                echo json_encode([
                    "success" => false, 
                    "message" => "Method not allowed. Expected $allowedMethods."
                ]);
                exit();
            }
        }
    }

    /**
     * Reads and decodes JSON from the request body.
     * Halts execution with a 400 response if JSON is malformed.
     *
     * @param bool $asArray Return as associative array (default true)
     * @return mixed
     */
    public static function getJsonPayload($asArray = true) {
        $raw = file_get_contents("php://input");
        $data = json_decode($raw, $asArray);
        
        // Check for JSON decoding errors
        if ($data === null && json_last_error() !== JSON_ERROR_NONE) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Invalid JSON payload."]);
            exit();
        }
        
        return $data ?: ($asArray ? [] : new stdClass());
    }
}
