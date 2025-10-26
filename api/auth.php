<?php
require_once("../config.php");

header('Content-Type: application/json');
$action = $_POST['action'] ?? '';

if ($action === 'register') {
    try {
        $username = trim($_POST['username'] ?? '');
        $email = trim($_POST['email'] ?? '');
        $password = $_POST['password'] ?? '';

        // Validaciones
        if (empty($username) || empty($email) || empty($password)) {
            echo json_encode(['success' => false, 'error' => 'Todos los campos son obligatorios']);
            exit;
        }

        if (strlen($username) < 3) {
            echo json_encode(['success' => false, 'error' => 'El usuario debe tener al menos 3 caracteres']);
            exit;
        }

        if (strlen($password) < 6) {
            echo json_encode(['success' => false, 'error' => 'La contraseña debe tener al menos 6 caracteres']);
            exit;
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            echo json_encode(['success' => false, 'error' => 'Email inválido']);
            exit;
        }

        // Verificar si el usuario ya existe
        $stmt = $pdo->prepare("SELECT id FROM usuarios WHERE username = ? OR email = ?");
        $stmt->execute([$username, $email]);
        if ($stmt->fetch()) {
            echo json_encode(['success' => false, 'error' => 'El usuario o email ya existe']);
            exit;
        }

        // Crear usuario
        $password_hash = password_hash($password, PASSWORD_BCRYPT);
        $color = sprintf("#%06X", mt_rand(0, 0xFFFFFF));
        
        $stmt = $pdo->prepare("INSERT INTO usuarios (username, email, password_hash, color) VALUES (?, ?, ?, ?)");
        $stmt->execute([$username, $email, $password_hash, $color]);
        
        echo json_encode(['success' => true]);
        
    } catch (PDOException $e) {
        error_log("Error en registro: " . $e->getMessage());
        echo json_encode(['success' => false, 'error' => 'Error al crear usuario. Intenta de nuevo.']);
    }
    exit;
}

if ($action === 'login') {
    try {
        $username = trim($_POST['username'] ?? '');
        $password = $_POST['password'] ?? '';

        if (empty($username) || empty($password)) {
            echo json_encode(['success' => false, 'error' => 'Usuario y contraseña requeridos']);
            exit;
        }

        $stmt = $pdo->prepare("SELECT * FROM usuarios WHERE username = ?");
        $stmt->execute([$username]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user && password_verify($password, $user['password_hash'])) {
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['username'] = $user['username'];
            $_SESSION['color'] = $user['color'];
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'error' => 'Usuario o contraseña incorrectos']);
        }
        
    } catch (PDOException $e) {
        error_log("Error en login: " . $e->getMessage());
        echo json_encode(['success' => false, 'error' => 'Error de autenticación']);
    }
    exit;
}

echo json_encode(['success' => false, 'error' => 'Acción no válida']);
?>