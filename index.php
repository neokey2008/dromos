<?php
require_once("config.php");
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit;
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Dromos - Conquista tu Territorio</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- Leaflet CSS -->
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    
    <!-- Leaflet JS -->
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    
    <!-- Turf.js para cálculos geométricos -->
    <script src="https://cdn.jsdelivr.net/npm/@turf/turf@6/turf.min.js"></script>
    
    <link rel="stylesheet" href="css/styles.css">
    
    <!-- Configuración del mapa -->
    <script src="js/config-map.js"></script>
    
    <style>
        #map {
            height: 100%;
            width: 100%;
        }
    </style>
</head>
<body class="bg-gray-900 text-white flex flex-col h-screen">

<header class="bg-gray-800 p-3 flex justify-between items-center">
    <div>
        <h1 class="text-lg font-bold">🏃‍♂️ Dromos</h1>
        <p class="text-xs text-gray-400">Usuario: <?php echo htmlspecialchars($_SESSION['username'] ?? 'Usuario'); ?></p>
    </div>
    <div class="flex gap-2">
        <button id="btnLimpiar" class="bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded text-sm">Limpiar</button>
        <button id="btnCentrar" class="bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded text-sm">📍 Centrar</button>
        <a href="logout.php" class="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm inline-block">Salir</a>
    </div>
</header>

<main class="flex-grow relative">
    <div id="map"></div>

    <div class="absolute top-5 left-5 bg-gray-800 bg-opacity-90 p-3 rounded-lg text-sm z-[1000]">
        <div id="status" class="text-yellow-400">Esperando GPS...</div>
        <div id="coords" class="text-gray-300 mt-1"></div>
        <div id="pathInfo" class="text-blue-400 mt-1">Puntos: 0</div>
        <div id="areaInfo" class="text-green-400 mt-1">Área: 0 m²</div>
    </div>

    <button id="btnGuardar" class="absolute bottom-5 left-1/2 -translate-x-1/2 bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed z-[1000]">
        💾 Guardar Territorio
    </button>
</main>

<section class="bg-gray-800 p-3 text-center border-t border-gray-700">
    <h2 class="text-lg font-bold mb-2">🏆 Ranking Global</h2>
    <div id="ranking" class="text-sm space-y-1 max-h-32 overflow-y-auto"></div>
</section>

<script src="js/app-leaflet.js"></script>
</body>
</html>