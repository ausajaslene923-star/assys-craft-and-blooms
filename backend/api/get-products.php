<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET");

require_once __DIR__ . "/../config/database.php";

try {
    $database = new Database();
    $conn = $database->connect();

    $sql = "SELECT
                id,
                name,
                description,
                image,
                price,
                category,
                stock,
                status,
                created_at
            FROM products
            ORDER BY id DESC";

    $statement = $conn->prepare($sql);
    $statement->execute();

    $products = $statement->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "products" => $products
    ]);

} catch (Throwable $error) {
    http_response_code(500);

    error_log($error->getMessage());

    echo json_encode([
        "success" => false,
        "message" => "Unable to retrieve products."
    ]);
}