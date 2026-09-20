<?php
require_once __DIR__ . '/BaseModel.php';

class PlatformReview extends BaseModel {
    protected $table_name = 'platform_reviews';

    protected ?int $id = null;
    protected ?int $user_id = null;
    protected ?int $rating = null;
    protected ?string $comment = null;
    protected ?string $created_at = null;

    public function submitReview($userId, $rating, $comment) {
        $this->qb->table('platform_reviews')->insert([
            'user_id' => $userId,
            'rating' => $rating,
            'comment' => $comment,
            'created_at' => QueryBuilder::raw('NOW()')
        ]);
        return true;
    }

    public function getReviews() {
        return $this->qb->table('platform_reviews', 'pr')
            ->select([
                'pr.id',
                'pr.rating AS stars',
                'pr.comment AS text',
                'pr.created_at',
                'u.userRole',
                'c.name AS customerName',
                'c.profilePhoto AS customerPhoto',
                'c.address AS customerAddress',
                's.owner AS shopOwnerName',
                's.name AS shopName',
                's.profileImageURL AS shopPhoto',
                's.address AS shopAddress'
            ])
            ->join('users u', 'u.id', '=', 'pr.user_id')
            ->leftJoin('customer c', "c.id = u.id AND u.userRole = 'customer'")
            ->leftJoin('shop s', "s.id = u.id AND u.userRole = 'shop_owner'")
            ->orderBy('pr.rating', 'DESC')
            ->orderBy('pr.created_at', 'DESC')
            ->limit(15)
            ->get();
    }
}
