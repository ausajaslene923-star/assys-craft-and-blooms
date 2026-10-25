
<?php

class Database
{
    private $host = "localhost";
    private $db_name = "assys_craft_blooms";
    private $username = "root";
    private $password = "";

    public $conn;

    public function connect()
    {
        $this->conn = null;

        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name . ";charset=utf8mb4",
                $this->username,
                $this->password
            );

            $this->conn->setAttribute(
                PDO::ATTR_ERRMODE,
                PDO::ERRMODE_EXCEPTION
            );

        } catch (PDOException $exception) {
            error_log("Database connection error: " . $exception->getMessage());
            throw new RuntimeException("Database connection failed.");
        }

        return $this->conn;
    }
}
