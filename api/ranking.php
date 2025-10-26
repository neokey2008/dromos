<?php
require_once("../config.php");
header('Content-Type: application/json');

try {
    $stmt = $pdo->query("SELECT u.username, u.color, COALESCE(SUM(t.area), 0) AS area_total
                         FROM usuarios u
                         LEFT JOIN territorios t ON t.usuario_id = u.id
                         GROUP BY u.id, u.username, u.color
                         ORDER BY area_total DESC
                         LIMIT 10");
    
    $ranking = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($ranking);
    
} catch (PDOException $e) {
    error_log("Error en ranking: " . $e->getMessage());
    echo json_encode([]);
}
?>