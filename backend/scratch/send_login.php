<?php
$url = "http://localhost:8000/api/login.php";
$data = [
    "email" => "testlogin@gmail.com",
    "password" => "testpassword"
];

$options = [
    'http' => [
        'header'  => "Content-type: application/json\r\n",
        'method'  => 'POST',
        'content' => json_encode($data),
        'ignore_errors' => true // so we can see 401/403 responses
    ]
];

$context  = stream_context_create($options);
$result = file_get_contents($url, false, $context);

echo "Response headers:\n";
print_r($http_response_header);
echo "\nResponse body:\n";
echo $result . "\n";
