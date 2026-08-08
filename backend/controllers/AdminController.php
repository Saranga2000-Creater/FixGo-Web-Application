<?php

require_once __DIR__ . '/../models/Shop.php';
require_once __DIR__ . '/../models/ServiceRequest.php';
require_once __DIR__ . '/../models/userRole.php';
require_once __DIR__ . '/../models/ShopInvoice.php';

class AdminController {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    /**
     * Dashboard Overview API
     * Orchestrates data collection from multiple models to populate the Admin Dashboard.
     * Follows 'Thin Controller' pattern by delegating SQL to Models.
     */
    public function getDashboardOverview() {
        try {
            // Instantiate models
            $shopModel = new Shop($this->db);
            $serviceRequestModel = new ServiceRequest($this->db);
            $userRoleModel = new User($this->db);
            $shopInvoiceModel = new ShopInvoice($this->db);

            // Fetch Pending Shops logic
            // We just need a count of active=0 and is_email_verified=1 shop owners.
            $pendingShopCount = $userRoleModel->getPendingShopOwnerCount();

            // Fetch Pending Invoices
            $pendingInvoiceCount = $shopInvoiceModel->getPendingInvoiceCount();

            // Combine for the single 'Pending Verifications' KPI card
            $totalPendingVerifications = $pendingShopCount + $pendingInvoiceCount;

            // Determine which timeline to fetch based on filter
            $timelineFilter = $_GET['timelineFilter'] ?? '30days';
            $timelineData = ($timelineFilter === '12months') 
                ? $serviceRequestModel->getMonthlyVolume() 
                : $serviceRequestModel->getDailyVolume(30);

            // Assemble data
            $data = [
                'kpis' => [
                    'activeShops' => $shopModel->getActiveCount(),
                    'pendingVerifications' => $totalPendingVerifications,
                    'mtdServiceRequests' => $serviceRequestModel->getMTDCount(),
                    'activeCustomers' => $userRoleModel->getActiveCustomerCount(),
                ],
                'financialSnapshot' => [
                    'pendingInvoices' => $pendingInvoiceCount,
                    'overdueInvoices' => $shopInvoiceModel->getOverdueInvoiceCount(),
                ],
                'charts' => [
                    'serviceRequestsTimeline' => $timelineData,
                    'shopCategoryDistribution' => $shopModel->getCategoryDistribution(),
                    'userRoleDistribution' => $userRoleModel->getUserRoleDistribution(),
                ]
            ];

            http_response_code(200);
            echo json_encode([
                "success" => true,
                "data" => $data
            ]);

        } catch (Throwable $e) {
            http_response_code(500);
            echo json_encode([
                "success" => false,
                "message" => "Failed to load dashboard data.",
                "error" => $e->getMessage()
            ]);
        }
    }

    /**
     * Admin: Approve a pending shop owner account.
     * Reads { shopId } from the JSON request body.
     */
    public function approveShop(): void {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            http_response_code(405);
            echo json_encode(["success" => false, "message" => "Method not allowed."]);
            return;
        }

        $data   = json_decode(file_get_contents("php://input"));
        $shopId = isset($data->shopId) ? intval($data->shopId) : 0;

        if ($shopId <= 0) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Valid shopId is required."]);
            return;
        }

        try {
            $shopModel = new Shop($this->db);
            $result    = $shopModel->approveShop($shopId);

            switch ($result) {
                case 'approved':
                    http_response_code(200);
                    echo json_encode(["success" => true, "message" => "Shop approved successfully."]);
                    break;
                case 'already_active':
                    http_response_code(200);
                    echo json_encode(["success" => true, "message" => "Shop is already active."]);
                    break;
                default:
                    http_response_code(404);
                    echo json_encode(["success" => false, "message" => "Shop not found or email not yet verified."]);
            }
        } catch (Throwable $e) {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Server error.", "debug" => $e->getMessage()]);
        }
    }

    /**
     * Admin: Get all shop owner accounts pending approval.
     */
    public function getPendingShops(): void {
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            http_response_code(405);
            echo json_encode(["success" => false, "message" => "Method not allowed."]);
            return;
        }

        try {
            $shopModel = new Shop($this->db);
            $shops     = $shopModel->getPendingApprovals();
            http_response_code(200);
            echo json_encode(["success" => true, "data" => $shops]);
        } catch (Throwable $e) {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Server error.", "debug" => $e->getMessage()]);
        }
    }
}
