<?php

require_once __DIR__ . '/../models/Customer.php';

class CustomerController {
    private $db;
    private $baseUrl;

    public function __construct($db) {
        $this->db = $db;
        $this->baseUrl = rtrim(getenv('APP_URL') ?: 'http://localhost:8000', '/');
    }

    public function getProfile($customerId) {
        $customerModel = new Customer($this->db);
        $customer = $customerModel->getById($customerId);

        if (!$customer) {
            http_response_code(404);
            echo json_encode([
                'success' => false,
                'message' => 'Customer not found'
            ]);
            return;
        }

        $photoUrl = null;
        if (!empty($customer['profilePhoto'])) {
            $photoUrl = $this->baseUrl . '/' . $customer['profilePhoto'];
        }

        echo json_encode([
            'success'       => true,
            'id'            => $customer['id'],
            'name'          => $customer['name'],
            'email'         => $customer['email'],
            'contactNumber' => $customer['contactNumber'],
            'address'       => $customer['address'],
            'profilePhoto'  => $photoUrl,
            'memberSince'   => date('F d, Y', strtotime($customer['createdAt'])),
        ]);
    }
}