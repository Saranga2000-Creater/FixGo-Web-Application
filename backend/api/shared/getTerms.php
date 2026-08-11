<?php

require_once __DIR__ . '/../../config/bootstrap.php';

$termsFile = __DIR__ . '/../../config/terms.json';

if (file_exists($termsFile)) {
    $termsJson = file_get_contents($termsFile);
    http_response_code(200);
    echo $termsJson;
} else {
    http_response_code(404);
    echo json_encode(["message" => "Terms and conditions not found."]);
}
