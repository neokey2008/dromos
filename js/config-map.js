// ===============================================
// CONFIGURACIÓN DEL ÁREA DE JUEGO
// ===============================================
// Cambia estas coordenadas para definir el centro de tu zona de juego

const GAME_CONFIG = {
    // 🌎 Centro del área de juego (cambia según tu ubicación)
    center: {
        lat: 21.864851,     // Latitud del centro
        lng:  -101.594457,   // Longitud del centro
        name: "Ojuelos de Jalisco, Jalisco" // Nombre del lugar
    },
    
    // 📏 Radio del área de juego en kilómetros
    radiusKm: 3,
    
    // 🎯 Configuración del juego
    minPoints: 3,              // Puntos mínimos para crear territorio
    minDistanceBetweenPoints: 2, // Metros mínimos entre puntos
    updateInterval: 3000,      // Milisegundos entre actualizaciones GPS
    maxPathPoints: 1000,       // Máximo de puntos por territorio
    
    // 🗺️ Configuración del mapa
    defaultZoom: 14,           // Zoom inicial
    playerZoom: 17,            // Zoom cuando se detecta al jugador
    
    // 🎨 Colores
    limitCircleColor: '#FF0000',
    playerMarkerColor: '#00FF00',
    pathColor: '#00FF00'
};

// ===============================================
// UBICACIONES COMUNES (para cambiar rápido)
// ===============================================
const COMMON_LOCATIONS = {
    // encarnacion: { lat: 20.626, lng: -102.267, name: "Encarnación de Díaz, Jalisco" },
    guadalajara: { lat: 20.6597, lng: -103.3496, name: "Guadalajara, Jalisco" },
    cdmx: { lat: 19.4326, lng: -99.1332, name: "Ciudad de México" },
    monterrey: { lat: 25.6866, lng: -100.3161, name: "Monterrey" },
    // Agrega más ubicaciones aquí...
};

// Para cambiar de ubicación rápido, descomenta una de estas líneas:
// GAME_CONFIG.center = COMMON_LOCATIONS.guadalajara;
// GAME_CONFIG.center = COMMON_LOCATIONS.cdmx;
// GAME_CONFIG.center = COMMON_LOCATIONS.monterrey;