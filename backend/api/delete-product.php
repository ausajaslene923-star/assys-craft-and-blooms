
<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

require_once __DIR__ . "/../config/database.php";

try {

    if ($_SERVER["REQUEST_METHOD"] !== "POST") {
        throw new Exception("Invalid request method.");
    }

    $database = new Database();
    $conn = $database->connect();

    $id = filter_var($_POST["id"] ?? null, FILTER_VALIDATE_INT);

    if (!$id || $id < 1) {
        throw new Exception("Invalid product ID.");
    }

    $statement = $conn->prepare(
        "DELETE FROM products WHERE id = :id"
    );

    $statement->execute([
        ":id" => $id
    ]);

    if ($statement->rowCount() === 0) {
        throw new Exception("Product not found.");
    }

    echo json_encode([
        "success" => true,
        "message" => "Product deleted successfully."
    ]);

} catch (Throwable $error) {

    http_response_code(400);
    error_log($error->getMessage());

    echo json_encode([
        "success" => false,
        "message" => $error->getMessage()
    ]);
}
