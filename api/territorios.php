<?php
require_once("../config.php");
header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    http_response_code(403);
    echo json_encode(['error' => 'No autenticado']);
    exit;
}

$user_id = $_SESSION['user_id'];
$action = $_POST['action'] ?? 'list';

if ($action === 'save') {
    try {
        $nombre = $_POST['nombre'] ?? 'Territorio';
        $puntos_json = $_POST['puntos_json'] ?? '';
        $area = floatval($_POST['area'] ?? 0);
        $lat = floatval($_POST['centro_lat'] ?? 0);
        $lng = floatval($_POST['centro_lng'] ?? 0);

        // Validaciones
        if (empty($puntos_json)) {
            echo json_encode(['success' => false, 'error' => 'Datos de territorio inválidos']);
            exit;
        }

        // Validar que el JSON sea válido
        $puntos = json_decode($puntos_json, true);
        if (!$puntos || count($puntos) < 3) {
            echo json_encode(['success' => false, 'error' => 'El territorio debe tener al menos 3 puntos']);
            exit;
        }

        if ($area < 10) {
            echo json_encode(['success' => false, 'error' => 'El área es muy pequeña (mínimo 10 m²)']);
            exit;
        }

        // Guardar territorio
        $stmt = $pdo->prepare("INSERT INTO territorios (usuario_id, nombre, puntos_json, area, centro_lat, centro_lng) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([$user_id, $nombre, $puntos_json, $area, $lat, $lng]);
        
        echo json_encode(['success' => true, 'territorio_id' => $pdo->lastInsertId()]);
        
    } catch (PDOException $e) {
        error_log("Error guardando territorio: " . $e->getMessage());
        echo json_encode(['success' => false, 'error' => 'Error al guardar territorio']);
    }
    exit;
}

if ($action === 'list') {
    try {
        $stmt = $pdo->query("SELECT t.*, u.username, u.color 
                             FROM territorios t 
                             JOIN usuarios u ON u.id = t.usuario_id
                             ORDER BY t.created_at DESC");
        $territorios = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($territorios);
        
    } catch (PDOException $e) {
        error_log("Error listando territorios: " . $e->getMessage());
        echo json_encode([]);
    }
    exit;
}

if ($action === 'delete') {
    try {
        $territorio_id = intval($_POST['territorio_id'] ?? 0);
        
        // Verificar que el territorio pertenezca al usuario
        $stmt = $pdo->prepare("DELETE FROM territorios WHERE id = ? AND usuario_id = ?");
        $stmt->execute([$territorio_id, $user_id]);
        
        if ($stmt->rowCount() > 0) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'error' => 'Territorio no encontrado o no autorizado']);
        }
        
    } catch (PDOException $e) {
        error_log("Error eliminando territorio: " . $e->getMessage());
        echo json_encode(['success' => false, 'error' => 'Error al eliminar territorio']);
    }
    exit;
}

echo json_encode(['success' => false, 'error' => 'Acción no válida']);
?>