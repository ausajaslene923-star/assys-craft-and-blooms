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

    $name = trim($_POST["name"] ?? "");
    $description = trim($_POST["description"] ?? "");
    $category = trim($_POST["category"] ?? "");
    $price = $_POST["price"] ?? "";
    $stock = $_POST["stock"] ?? "";

    if (
        $name === "" ||
        $category === "" ||
        !is_numeric($price) ||
        !is_numeric($stock) ||
        (float)$price < 0 ||
        (int)$stock < 0 ||
        (float)$stock != (int)$stock
    ) {
        throw new Exception("Please provide valid product information.");
    }

    if (!isset($_FILES["image"]) ||
        $_FILES["image"]["error"] !== UPLOAD_ERR_OK) {
        throw new Exception("Please select a product image.");
    }

    $image = $_FILES["image"];

    $allowedTypes = [
        "image/jpeg" => "jpg",
        "image/png" => "png",
        "image/webp" => "webp"
    ];

    $fileInfo = new finfo(FILEINFO_MIME_TYPE);
    $mimeType = $fileInfo->file($image["tmp_name"]);

    if (!isset($allowedTypes[$mimeType])) {
        throw new Exception("Only JPG, PNG, and WEBP images are allowed.");
    }

    if ($image["size"] > 5 * 1024 * 1024) {
        throw new Exception("Image must not exceed 5 MB.");
    }

    $uploadDirectory = __DIR__ . "/../../public/image/products/";

    if (!is_dir($uploadDirectory)) {
        throw new Exception("Product image folder was not found.");
    }

    $extension = $allowedTypes[$mimeType];
    $imageName = uniqid("product_", true) . "." . $extension;
    $imagePath = $uploadDirectory . $imageName;

    if (!move_uploaded_file($image["tmp_name"], $imagePath)) {
        throw new Exception("Unable to upload product image.");
    }

    $sql = "INSERT INTO products
            (name, description, image, price, category, stock, status)
            VALUES
            (:name, :description, :image, :price, :category, :stock, 'active')";

    $statement = $conn->prepare($sql);

    $statement->execute([
        ":name" => $name,
        ":description" => $description,
        ":image" => $imageName,
        ":price" => $price,
        ":category" => $category,
        ":stock" => (int)$stock
    ]);

    echo json_encode([
        "success" => true,
        "message" => "Product added successfully.",
        "product_id" => $conn->lastInsertId(),
        "image" => $imageName
    ]);

} catch (Throwable $error) {

    http_response_code(400);

    error_log($error->getMessage());

    echo json_encode([
        "success" => false,
        "message" => $error->getMessage()
    ]);
}