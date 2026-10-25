<?php

require_once __DIR__ . "/config/database.php";

try {
    $database = new Database();
    $conn = $database->connect();

    $email = "admin@assyscraft.com";
    $password = "";

    // Generate a secure password hash
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    // Update the existing admin account
    $sql = "UPDATE users
            SET full_name = :full_name,
                password = :password,
                account_type = 'admin'
            WHERE email = :email";

    $statement = $conn->prepare($sql);

    $statement->execute([
        ":full_name" => "System Administrator",
        ":password" => $hashedPassword,
        ":email" => $email
    ]);

    if ($statement->rowCount() > 0) {
        echo "Admin account password successfully updated!";
    } else {
        echo "No account was updated. Please check the admin email.";
    }

} catch (Throwable $error) {
    echo "Error: " . $error->getMessage();
}