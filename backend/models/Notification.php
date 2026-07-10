<?php

class Notification {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    public function getByUser($userId) {
        // NOTE: `notification` has no status column of its own — `type` already
        // stores the status snapshot at creation time (e.g. 'Accepted',
        // 'In Progress', 'Completed'), so it's aliased to `status` here for the
        // frontend. `notification` also has no created_at column, so the
        // linked servicerequest's created_at is used for the timestamp instead.
        $stmt = $this->db->prepare(
            "SELECT
                n.id,
                n.service_request_id,
                n.type,
                n.title,
                n.message,
                n.isRead,
                n.type AS status,
                sr.status AS current_status,
                sr.shop_id,
                sr.requires_tow,
                sr.vehicle_brand,
                sr.dispatched_driver_name,
                sr.dispatched_driver_phone,
                sr.dispatched_truck_brand,
                sr.dispatched_truck_color,
                sr.dispatched_truck_plate,
                sr.promised_eta,
                sr.pickup_landmark,
                sr.created_at,
                s.name AS shop_name
             FROM notification n
             LEFT JOIN servicerequest sr ON n.service_request_id = sr.id
             LEFT JOIN shop s ON sr.shop_id = s.id
             WHERE n.user_id = :user_id
             ORDER BY n.id DESC"
        );
        $stmt->execute(['user_id' => $userId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function markOneRead($userId, $notificationId) {
        // Scoped to this user so one customer can't flip another's notification.
        $stmt = $this->db->prepare(
            "UPDATE notification SET isRead = 1 WHERE id = :id AND user_id = :user_id"
        );
        return $stmt->execute([
            'id'      => $notificationId,
            'user_id' => $userId,
        ]);
    }

    public function markAllRead($userId) {
        $stmt = $this->db->prepare(
            "UPDATE notification SET isRead = 1 WHERE user_id = :user_id"
        );
        return $stmt->execute(['user_id' => $userId]);
    }
}