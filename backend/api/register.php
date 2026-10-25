
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

    $fullName = trim($data["full_name"] ?? "");
    $email = trim($data["email"] ?? "");
    $contactNumber = trim($data["contact_number"] ?? "");
    $password = $data["password"] ?? "";
    $confirmPassword = $data["confirm_password"] ?? "";

    // Check required fields
    if (
        $fullName === "" ||
        $email === "" ||
        $contactNumber === "" ||
        $password === "" ||
        $confirmPassword === ""
    ) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Please complete all required fields."
        ]);
        exit;
    }

    // Validate email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Please enter a valid email address."
        ]);
        exit;
    }

    // Validate password length
    if (strlen($password) < 8) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Password must be at least 8 characters."
        ]);
        exit;
    }

    // Check password confirmation
    if ($password !== $confirmPassword) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Passwords do not match."
        ]);
        exit;
    }

    // Connect to database
    $database = new Database();
    $conn = $database->connect();

    // Check existing email
    $checkEmail = $conn->prepare(
        "SELECT id FROM users WHERE email = :email LIMIT 1"
    );

    $checkEmail->execute([
        ":email" => $email
    ]);

    if ($checkEmail->fetch()) {
        http_response_code(409);
        echo json_encode([
            "success" => false,
            "message" => "This email is already registered."
        ]);
        exit;
    }

    // Securely hash password
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    // Register as customer only
    $sql = "INSERT INTO users
            (full_name, email, contact_number, password, account_type)
            VALUES
            (:full_name, :email, :contact_number, :password, 'customer')";

    $statement = $conn->prepare($sql);

    $statement->execute([
        ":full_name" => $fullName,
        ":email" => $email,
        ":contact_number" => $contactNumber,
        ":password" => $hashedPassword
    ]);

    http_response_code(201);

    echo json_encode([
        "success" => true,
        "message" => "Your account has been created successfully!"
    ]);

} catch (PDOException $error) {
    error_log("Registration database error: " . $error->getMessage());

    if ($error->getCode() === "23000") {
        http_response_code(409);
        echo json_encode([
            "success" => false,
            "message" => "This email is already registered."
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Registration failed. Please try again."
        ]);
    }

} catch (Throwable $error) {
    error_log("Registration error: " . $error->getMessage());

    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Something went wrong. Please try again."
    ]);
}
