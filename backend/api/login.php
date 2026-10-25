
<?php

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode([
        "success" => false,
        "message" => "Method not allowed."
    ]);
    exit;
}

require_once __DIR__ . "/../config/database.php";

try {
    $data = json_decode(file_get_contents("php://input"), true);

    if (!is_array($data)) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Invalid request data."
        ]);
        exit;
    }

    $email = trim($data["email"] ?? "");
    $password = $data["password"] ?? "";
    $accountType = $data["account_type"] ?? "";

    if ($email === "" || $password === "" || $accountType === "") {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Please complete all login fields."
        ]);
        exit;
    }

    if (!in_array($accountType, ["customer", "admin"], true)) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Invalid account type."
        ]);
        exit;
    }

    $database = new Database();
    $conn = $database->connect();

    $sql = "SELECT id, full_name, email, password, account_type
            FROM users
            WHERE email = :email
            AND account_type = :account_type
            LIMIT 1";

    $statement = $conn->prepare($sql);

    $statement->execute([
        ":email" => $email,
        ":account_type" => $accountType
    ]);

    $user = $statement->fetch(PDO::FETCH_ASSOC);

    if (!$user || !password_verify($password, $user["password"])) {
        http_response_code(401);
        echo json_encode([
            "success" => false,
            "message" => "Incorrect email, password, or account type."
        ]);
        exit;
    }

    echo json_encode([
        "success" => true,
        "message" => "Login successful!",
        "user" => [
            "id" => $user["id"],
            "full_name" => $user["full_name"],
            "email" => $user["email"],
            "account_type" => $user["account_type"]
        ]
    ]);

} catch (Throwable $error) {
    error_log("Login error: " . $error->getMessage());

    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Login failed. Please try again."
    ]);
}
