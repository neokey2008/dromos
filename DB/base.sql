-- Active: 1760454034549@@127.0.0.1@3306@dromos
CREATE DATABASE dromos CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE dromos;

CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  color VARCHAR(7) DEFAULT '#eb1a1aff',
  puntos INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sesiones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  token VARCHAR(255) NOT NULL,
  expires_at DATETIME NOT NULL,
  FOREIGN KEY (user_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE territorios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  nombre VARCHAR(100),
  puntos_json TEXT NOT NULL,  -- coordenadas GPS del polígono
  area FLOAT NOT NULL,
  centro_lat DECIMAL(10,8) NOT NULL,
  centro_lng DECIMAL(11,8) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE VIEW v_ranking AS
SELECT u.id, u.username, u.color, COALESCE(SUM(t.area),0) AS area_total
FROM usuarios u
LEFT JOIN territorios t ON t.usuario_id = u.id
GROUP BY u.id
ORDER BY area_total DESC;
