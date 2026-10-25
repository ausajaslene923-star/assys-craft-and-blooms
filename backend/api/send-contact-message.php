
<?php

header("Content-Type: application/json");

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
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

    $input = json_decode(file_get_contents("php://input"), true);

    if (!is_array($input)) {
        throw new InvalidArgumentException("Invalid request data.");
    }

    $name = trim($input["name"] ?? "");
    $email = trim($input["email"] ?? "");
    $subject = trim($input["subject"] ?? "");
    $message = trim($input["message"] ?? "");

    if (
        $name === "" ||
        $email === "" ||
        $subject === "" ||
        $message === ""
    ) {
        throw new InvalidArgumentException(
            "Please complete all required fields."
        );
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new InvalidArgumentException(
            "Please enter a valid email address."
        );
    }

    if (
        strlen($name) > 150 ||
        strlen($email) > 150 ||
        strlen($subject) > 200
    ) {
        throw new InvalidArgumentException(
            "One or more fields are too long."
        );
    }

    $database = new Database();
    $conn = $database->connect();

    $sql = "INSERT INTO contact_messages
            (name, email, subject, message)
            VALUES
            (:name, :email, :subject, :message)";

    $stmt = $conn->prepare($sql);

    $stmt->execute([
        ":name" => $name,
        ":email" => $email,
        ":subject" => $subject,
        ":message" => $message
    ]);

    echo json_encode([
        "success" => true,
        "message" => "Your message has been sent successfully!"
    ]);

} catch (InvalidArgumentException $error) {

    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => $error->getMessage()
    ]);

} catch (Throwable $error) {

    error_log("Contact message error: " . $error->getMessage());

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Unable to send your message. Please try again later."
    ]);
}
