<?php
require_once("config.php");
if (isset($_SESSION['user_id'])) {
    header("Location: index.php");
    exit;
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Login - Dromos</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="css/styles.css">
</head>
<body class="bg-gray-900 flex items-center justify-center h-screen text-white">
    <div class="bg-gray-800 p-6 rounded-xl w-80 shadow-lg text-center">
        <h2 class="text-2xl font-bold mb-4">🏃‍♂️ Dromos</h2>
        <p class="text-gray-400 text-sm mb-4">Conquista tu territorio</p>
        <form id="loginForm">
            <input type="text" name="username" placeholder="Usuario" required 
                   class="w-full p-2 mb-2 bg-gray-700 rounded text-white" autocomplete="username">
            <input type="password" name="password" placeholder="Contraseña" required
                   class="w-full p-2 mb-4 bg-gray-700 rounded text-white" autocomplete="current-password">
            <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded font-semibold">
                Entrar
            </button>
        </form>
        <p class="mt-3 text-sm">¿No tienes cuenta? <a href="register.php" class="text-blue-400 hover:underline">Regístrate</a></p>
        <div id="message" class="mt-3 text-sm"></div>
    </div>
    
    <script src="js/auth.js"></script>
</body>
</html>