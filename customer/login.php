
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Login | Assy's Craft and Blooms</title>

    <!-- Bootstrap 5 -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
          rel="stylesheet">

    <!-- Custom CSS -->
    <link rel="stylesheet" href="../assets/css/login.css">
</head>

<body>

    <!-- HEADER -->
    <header class="login-header">
        <h2>Assy's Craft and Blooms</h2>
        <p>Handmade flowers, crafted with love.</p>
    </header>

    <!-- LOGIN SECTION -->
    <main class="login-container">

        <div class="login-card">

            <div class="text-center mb-4">
                <h2>Welcome Back!</h2>
                <p>Please login to continue.</p>
            </div>

            <form id="loginForm">

                <!-- ACCOUNT TYPE -->
                <div class="mb-3">
                    <label for="accountType" class="form-label">
                        Account Type
                    </label>

                    <select class="form-select" id="accountType" name="account_type" required>
                        <option value="" selected disabled>Select Account Type</option>
                        <option value="client">Client</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>

                <!-- EMAIL -->
                <div class="mb-3">
                    <label for="email" class="form-label">
                        Email Address
                    </label>

                    <input type="email"
                           class="form-control"
                           id="email"
                           name="email"
                           placeholder="Enter your email address"
                           required>
                </div>

                <!-- PASSWORD -->
                <div class="mb-3">
                    <label for="password" class="form-label">
                        Password
                    </label>

                    <div class="password-wrapper">
                        <input type="password"
                               class="form-control"
                               id="password"
                               name="password"
                               placeholder="Enter your password"
                               required>

                        <button type="button" id="togglePassword">
                            Show
                        </button>
                    </div>
                </div>

                <!-- LOGIN BUTTON -->
                <button type="button" class="btn login-btn w-100" id="loginButton">
                    Log In
                </button>

            </form>

            <div class="text-center mt-4">
                <p>
                    Don't have an account?
                    <a href="signup.php">Sign Up</a>
                </p>

                <a href="../index.html" class="back-link">
                    Back to Homepage
                </a>
            </div>

        </div>

    </main>

    <!-- BOOTSTRAP JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>

    <!-- CUSTOM JS -->
    <script src="../assets/js/login.js"></script>

</body>
</html>
