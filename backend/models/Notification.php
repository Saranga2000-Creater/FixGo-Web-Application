<?php
require_once __DIR__ . '/BaseModel.php';

class Notification extends BaseModel {
    protected $table_name = 'notification';

    protected ?int $id = null;
    protected ?int $user_id = null;
    protected ?int $service_request_id = null;
    protected ?string $type = null;
    protected ?string $title = null;
    protected ?string $message = null;
    protected ?int $isRead = null;
    protected ?string $created_at = null;

    public function getByUser($userId) {
        return $this->qb->table('notification', 'n')
            ->select(
                'n.id', 'n.service_request_id', 'n.type', 'n.title', 'n.message', 'n.isRead', 'n.type AS status',
                'sr.status AS current_status', 'sr.shop_id', 'sr.requires_tow', 'sr.vehicle_brand',
                'sr.dispatched_driver_name', 'sr.dispatched_driver_phone', 'sr.dispatched_truck_brand',
                'sr.dispatched_truck_color', 'sr.dispatched_truck_plate', 'sr.promised_eta', 'sr.pickup_landmark',
                'sr.created_at', 'sr.description AS request_description', 'sr.vehicle_color', 'sr.urgency_level',
                'sr.preferred_date', 'sr.preferred_time', 'sr.issue_category',
                's.name AS shop_name', 'c.name AS customer_name'
            )
            ->leftJoin('servicerequest sr', 'n.service_request_id', '=', 'sr.id')
            ->leftJoin('shop s', 'sr.shop_id', '=', 's.id')
            ->leftJoin('customer c', 'sr.customer_id', '=', 'c.id')
            ->where('n.user_id', $userId)
            ->orderBy('n.id', 'DESC')
            ->get();
    }

    public function markOneRead($userId, $notificationId) {
        $this->qb->table('notification')
            ->where('id', $notificationId)
            ->where('user_id', $userId)
            ->update(['isRead' => 1]);
        return true;
    }

    public function markAllRead($userId) {
        $this->qb->table('notification')
            ->where('user_id', $userId)
            ->update(['isRead' => 1]);
        return true;
    }

    public function createNotification($userId, $serviceRequestId, $type, $title) {
        $this->qb->table('notification')->insert([
            'user_id' => $userId,
            'service_request_id' => $serviceRequestId,
            'type' => $type,
            'title' => $title,
            'message' => null,
            'isRead' => 0
        ]);
        return true;
    }
}
?>