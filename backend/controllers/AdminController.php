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
}
