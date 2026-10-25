
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

    // GET PRODUCT INFORMATION
    $id = $_POST["id"] ?? "";
    $name = trim($_POST["name"] ?? "");
    $description = trim($_POST["description"] ?? "");
    $category = trim($_POST["category"] ?? "");
    $price = $_POST["price"] ?? "";
    $stock = $_POST["stock"] ?? "";
    $status = $_POST["status"] ?? "active";

    // VALIDATE INPUTS
    if (
        !ctype_digit((string)$id) ||
        (int)$id <= 0 ||
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

    if (!in_array($status, ["active", "inactive"], true)) {
        throw new Exception("Invalid product status.");
    }

    // CHECK IF PRODUCT EXISTS
    $check = $conn->prepare(
        "SELECT image FROM products WHERE id = :id"
    );

    $check->execute([":id" => (int)$id]);

    $existingProduct = $check->fetch(PDO::FETCH_ASSOC);

    if (!$existingProduct) {
        throw new Exception("Product not found.");
    }

    $oldImage = $existingProduct["image"];
    $imageName = $oldImage;

    $uploadDirectory = __DIR__ . "/../../public/image/products/";

    // CHECK IF A NEW IMAGE WAS UPLOADED
    if (
        isset($_FILES["image"]) &&
        $_FILES["image"]["error"] !== UPLOAD_ERR_NO_FILE
    ) {

        if ($_FILES["image"]["error"] !== UPLOAD_ERR_OK) {
            throw new Exception("Unable to upload the new product image.");
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

        if (!is_dir($uploadDirectory)) {
            throw new Exception("Product image folder was not found.");
        }

        $extension = $allowedTypes[$mimeType];
        $imageName = uniqid("product_", true) . "." . $extension;

        $imagePath = $uploadDirectory . $imageName;

        if (!move_uploaded_file($image["tmp_name"], $imagePath)) {
            throw new Exception("Unable to save the new product image.");
        }
    }

    // UPDATE PRODUCT
    $sql = "UPDATE products SET
                name = :name,
                description = :description,
                image = :image,
                price = :price,
                category = :category,
                stock = :stock,
                status = :status
            WHERE id = :id";

    $statement = $conn->prepare($sql);

    $statement->execute([
        ":name" => $name,
        ":description" => $description,
        ":image" => $imageName,
        ":price" => $price,
        ":category" => $category,
        ":stock" => (int)$stock,
        ":status" => $status,
        ":id" => (int)$id
    ]);

    // REMOVE OLD IMAGE AFTER SUCCESSFUL UPDATE
    if ($imageName !== $oldImage && !empty($oldImage)) {

        $oldImagePath = $uploadDirectory . basename($oldImage);

        if (is_file($oldImagePath)) {
            unlink($oldImagePath);
        }
    }

    echo json_encode([
        "success" => true,
        "message" => "Product updated successfully.",
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
