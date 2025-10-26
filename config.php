<?php
// ===============================
// CONFIGURACIÓN BASE DE DATOS
// ===============================
$host = "localhost";
$dbname = "dromos";
$user = "USUARIOSUPERSECRETO";
$pass = "CONTRASEÑASUPERSECRETA";

// ===============================
// CONEXIÓN PDO
// ===============================
try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500);
    die(json_encode(["error" => "Error de conexión: " . $e->getMessage()]));
}

// ===============================
// SESIÓN 
// ===============================
session_start();
if (!isset($_SESSION['token'])) {
    $_SESSION['token'] = bin2hex(random_bytes(32));
}
?>
