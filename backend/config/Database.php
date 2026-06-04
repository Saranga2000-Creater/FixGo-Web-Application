<?php
class Database {
    private $host = 'localhost';
    private $db_name = 'fixgo_db';
    private $user = 'root';
    private $password = '';
    private $conn;

    public function connect() {
        $this->conn = new mysqli(
            $this->host,
            $this->user,
            $this->password,
            $this->db_name
        );

        if ($this->conn->connect_error) {
            die(json_encode([
                'success' => false,
                'message' => 'Database Connection Error: ' . $this->conn->connect_error
            ]));
        }

        return $this->conn;
    }
}
?>
