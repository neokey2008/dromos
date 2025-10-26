let map, currentMarker, path = [], polygon, polyline, territorios = [], tracking = false;
let currentPosition = null;
let limitCircle = null;

// Usar configuración del archivo config-map.js
const CONFIG = {
    minPoints: GAME_CONFIG.minPoints,
    updateInterval: GAME_CONFIG.updateInterval,
    maxPathPoints: GAME_CONFIG.maxPathPoints,
    minDistance: GAME_CONFIG.minDistanceBetweenPoints,
    centerLat: GAME_CONFIG.center.lat,
    centerLng: GAME_CONFIG.center.lng,
    radiusKm: GAME_CONFIG.radiusKm
};

// Inicializar mapa inmediatamente
function initMapImmediate() {
    // Crear el mapa con posición por defecto
    map = L.map('map', {
        center: [CONFIG.centerLat, CONFIG.centerLng],
        zoom: 14,
        zoomControl: true
    });

    // Añadir capa de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);

    // Dibujar círculo de límite de 3km
    limitCircle = L.circle([CONFIG.centerLat, CONFIG.centerLng], {
        color: '#FF0000',
        fillColor: '#FF0000',
        fillOpacity: 0.1,
        radius: CONFIG.radiusKm * 1000, // Convertir a metros
        weight: 2,
        dashArray: '10, 10'
    }).addTo(map);

    // Añadir marcador central
    L.marker([CONFIG.centerLat, CONFIG.centerLng], {
        icon: L.divIcon({
            className: 'custom-center-marker',
            html: '<div style="background: #3B82F6; color: white; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: bold; white-space: nowrap; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">📍 Zona de Juego (3km)</div>',
            iconSize: [120, 30]
        })
    }).addTo(map);

    document.getElementById("status").innerHTML = "🗺️ Mapa cargado - Esperando GPS...";
    
    loadTerritorios();
    initRanking();
}

// Actualizar cuando se obtenga la posición GPS
function updateMapWithGPS(lat, lng) {
    // Verificar si está dentro del radio permitido
    const distance = calculateDistance(CONFIG.centerLat, CONFIG.centerLng, lat, lng);
    
    if (distance > CONFIG.radiusKm * 1000) {
        document.getElementById("status").innerHTML = 
            `⚠️ Fuera del área de juego (${(distance/1000).toFixed(2)}km del centro)`;
        return;
    }

    currentPosition = { lat, lng };
    
    document.getElementById("status").textContent = "✅ GPS Activo";
    document.getElementById("coords").textContent = `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`;

    if (currentMarker) {
        currentMarker.setLatLng([lat, lng]);
    } else {
        currentMarker = L.circleMarker([lat, lng], {
            radius: 8,
            fillColor: '#00FF00',
            color: '#FFFFFF',
            weight: 2,
            fillOpacity: 1
        }).addTo(map);
        currentMarker.bindPopup('Tu posición').openPopup();
    }

    map.panTo([lat, lng]);

    if (tracking) {
        addPoint(lat, lng);
    }
}

// Cargar territorios existentes
async function loadTerritorios() {
    try {
        const data = new FormData();
        data.append('action', 'list');
        const res = await fetch("api/territorios.php", { method: "POST", body: data });
        
        if (!res.ok) {
            console.error("Error al cargar territorios:", res.status);
            return;
        }

        territorios = await res.json();

        territorios.forEach(t => {
            try {
                const puntos = JSON.parse(t.puntos_json);
                
                // Convertir formato {lat, lng} a [lat, lng] para Leaflet
                const latLngs = puntos.map(p => [p.lat, p.lng]);
                
                // Dibujar polígono
                L.polygon(latLngs, {
                    color: t.color,
                    weight: 2,
                    fillColor: t.color,
                    fillOpacity: 0.35
                }).addTo(map);

                // Etiqueta con nombre de usuario
                const centro = [parseFloat(t.centro_lat), parseFloat(t.centro_lng)];
                L.marker(centro, {
                    icon: L.divIcon({
                        className: 'custom-label',
                        html: `<div style="background: ${t.color}; color: white; padding: 2px 6px; border-radius: 3px; font-size: 12px; font-weight: bold; white-space: nowrap;">${t.username}</div>`,
                        iconSize: [100, 20]
                    })
                }).addTo(map);
            } catch (error) {
                console.error("Error procesando territorio:", error);
            }
        });
    } catch (error) {
        console.error("Error cargando territorios:", error);
    }
}

// Ranking
async function initRanking() {
    try {
        const res = await fetch("api/ranking.php");
        
        if (!res.ok) {
            console.error("Error al cargar ranking:", res.status);
            return;
        }

        const ranking = await res.json();
        const div = document.getElementById("ranking");
        
        div.innerHTML = ranking.length > 0
            ? ranking.map((r, i) => {
                const area = parseFloat(r.area_total) || 0;
                return `<div class="text-gray-200">${i + 1}. <span style="color:${r.color}">${r.username}</span> - ${area.toFixed(2)} m²</div>`;
              }).join("")
            : '<div class="text-gray-400">No hay territorios aún</div>';
    } catch (error) {
        console.error("Error cargando ranking:", error);
        document.getElementById("ranking").innerHTML = '<div class="text-red-400">Error al cargar ranking</div>';
    }
}

// Actualizar posición
function updatePosition(lat, lng) {
    updateMapWithGPS(lat, lng);
}

// Calcular distancia entre dos puntos usando Haversine
function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371000; // Radio de la Tierra en metros
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// Agregar punto al path
function addPoint(lat, lng) {
    if (path.length >= CONFIG.maxPathPoints) {
        alert("Has alcanzado el límite de puntos");
        tracking = false;
        return;
    }

    // Evitar puntos duplicados muy cercanos
    if (path.length > 0) {
        const lastPoint = path[path.length - 1];
        const distance = calculateDistance(lastPoint.lat, lastPoint.lng, lat, lng);
        
        if (distance < CONFIG.minDistance) return;
    }

    path.push({ lat, lng });
    document.getElementById("pathInfo").textContent = `Puntos: ${path.length}`;

    updatePolygon();
}

// Actualizar polígono
function updatePolygon() {
    // Remover polígono y línea anterior
    if (polygon) map.removeLayer(polygon);
    if (polyline) map.removeLayer(polyline);

    if (path.length >= 2) {
        const latLngs = path.map(p => [p.lat, p.lng]);
        
        // Dibujar línea de trayectoria
        polyline = L.polyline(latLngs, {
            color: '#00FF00',
            weight: 3,
            opacity: 0.8
        }).addTo(map);

        // Si hay 3+ puntos, crear polígono
        if (path.length >= CONFIG.minPoints) {
            polygon = L.polygon(latLngs, {
                color: '#00FF00',
                weight: 3,
                fillColor: '#00FF00',
                fillOpacity: 0.35
            }).addTo(map);

            // Calcular área usando Turf.js
            const turfPolygon = turf.polygon([[...latLngs.map(ll => [ll[1], ll[0]]), [latLngs[0][1], latLngs[0][0]]]]);
            const area = turf.area(turfPolygon);
            
            document.getElementById("areaInfo").textContent = `Área: ${area.toFixed(2)} m²`;
        }
    }

    document.getElementById("btnGuardar").disabled = path.length < CONFIG.minPoints;
}

// Guardar territorio
async function saveTerritory() {
    if (path.length < CONFIG.minPoints) {
        alert(`Necesitas al menos ${CONFIG.minPoints} puntos para crear un territorio.`);
        return;
    }

    try {
        // Calcular área
        const latLngs = path.map(p => [p.lng, p.lat]); // Turf usa [lng, lat]
        const turfPolygon = turf.polygon([[...latLngs, latLngs[0]]]);
        const area = turf.area(turfPolygon);
        
        if (area < 10) {
            alert("El área es muy pequeña (mínimo 10 m²)");
            return;
        }

        // Calcular centro
        const centroid = turf.centroid(turfPolygon);
        const [lng, lat] = centroid.geometry.coordinates;

        const data = new FormData();
        data.append("action", "save");
        data.append("nombre", "Territorio");
        data.append("puntos_json", JSON.stringify(path));
        data.append("area", area);
        data.append("centro_lat", lat);
        data.append("centro_lng", lng);

        const res = await fetch("api/territorios.php", { method: "POST", body: data });
        
        if (!res.ok) {
            throw new Error("Error en la respuesta del servidor");
        }

        const json = await res.json();

        if (json.success) {
            alert(`✅ Territorio guardado: ${area.toFixed(2)} m²`);
            clearPath();
            await loadTerritorios();
            await initRanking();
        } else {
            alert("❌ Error: " + (json.error || "No se pudo guardar"));
        }
    } catch (error) {
        console.error("Error guardando territorio:", error);
        alert("❌ Error de conexión: " + error.message);
    }
}

// Limpiar path
function clearPath() {
    path = [];
    if (polygon) {
        map.removeLayer(polygon);
        polygon = null;
    }
    if (polyline) {
        map.removeLayer(polyline);
        polyline = null;
    }
    document.getElementById("pathInfo").textContent = "Puntos: 0";
    document.getElementById("areaInfo").textContent = "Área: 0 m²";
    document.getElementById("btnGuardar").disabled = true;
}

// Centrar mapa en posición actual
function centerMap() {
    if (currentPosition && map) {
        map.setView([currentPosition.lat, currentPosition.lng], 17);
    } else {
        // Si no hay GPS, centrar en el área de juego
        map.setView([CONFIG.centerLat, CONFIG.centerLng], 14);
    }
}

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
    // Inicializar mapa INMEDIATAMENTE (sin esperar GPS)
    initMapImmediate();
    
    document.getElementById("btnGuardar").addEventListener("click", saveTerritory);
    document.getElementById("btnLimpiar").addEventListener("click", clearPath);
    document.getElementById("btnCentrar").addEventListener("click", centerMap);

    // Iniciar tracking GPS
    if (navigator.geolocation) {
        // Función para obtener mensaje de error legible
        function getErrorString(code) {
            switch(code) {
                case 1: return 'Permiso denegado. Por favor, habilita los permisos de ubicación en la configuración de tu navegador.';
                case 2: return 'Ubicación no disponible. No se pudo determinar tu ubicación.';
                case 3: return 'Tiempo de espera agotado. Intenta de nuevo.';
                default: return 'Error desconocido al obtener la ubicación.';
            }
        }

        function iniciarGPS() {
            if (!navigator.geolocation) {
                document.getElementById("status").innerHTML = "⚠️ Tu navegador no soporta geolocalización";
                return;
            }

            // Mostrar mensaje de solicitud de permisos
            document.getElementById("status").innerHTML = "🔍 Solicitando permiso de ubicación...";
            
            // Opciones para getCurrentPosition y watchPosition
            const options = {
                enableHighAccuracy: true,  // Usar GPS si está disponible
                maximumAge: 0,           // No usar posiciones en caché
                timeout: 10000           // Tiempo máximo de espera en ms
            };

            // Primero verificamos si tenemos permisos
            if (navigator.permissions) {
                navigator.permissions.query({name:'geolocation'})
                    .then(permissionStatus => {
                        // Actualizar estado inicial
                        updatePermissionStatus(permissionStatus.state);
                        
                        // Escuchar cambios en los permisos
                        permissionStatus.onchange = () => {
                            updatePermissionStatus(permissionStatus.state);
                        };
                    });
            }

            // Función para actualizar la interfaz según el estado del permiso
            function updatePermissionStatus(state) {
                const statusElement = document.getElementById("status");
                switch(state) {
                    case 'granted':
                        statusElement.innerHTML = "✅ Permiso de ubicación concedido";
                        startWatching();
                        break;
                    case 'prompt':
                        statusElement.innerHTML = "🔍 Esperando tu respuesta para acceder a la ubicación...";
                        break;
                    case 'denied':
                        statusElement.innerHTML = "❌ Permiso de ubicación denegado. Por favor, actualiza los permisos en la configuración de tu navegador.";
                        break;
                }
            }

            // Función para iniciar el seguimiento de ubicación
            function startWatching() {
                // Obtener posición actual
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const lat = position.coords.latitude;
                        const lng = position.coords.longitude;
                        updatePosition(lat, lng);
                        updateMapWithGPS(lat, lng);
                        document.getElementById("status").innerHTML = "🟢 GPS activo - Movimiento detectado";
                        document.getElementById("coords").textContent = 
                            `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`;
                        
                        // Iniciar seguimiento continuo
                        navigator.geolocation.watchPosition(
                            (pos) => {
                                const newLat = pos.coords.latitude;
                                const newLng = pos.coords.longitude;
                                updatePosition(newLat, newLng);
                                document.getElementById("coords").textContent = 
                                    `Lat: ${newLat.toFixed(6)}, Lng: ${newLng.toFixed(6)}`;
                            },
                            (error) => {
                                console.error("Error en watchPosition:", error);
                                document.getElementById("status").innerHTML = 
                                    `⚠️ Error de GPS: ${getErrorString(error.code)}`;
                            },
                            options
                        );
                    },
                    (error) => {
                        console.error("Error en getCurrentPosition:", error);
                        document.getElementById("status").innerHTML = 
                            `⚠️ Error de GPS: ${getErrorString(error.code)}`;
                    },
                    options
                );
            }

            // Iniciar el proceso de obtención de ubicación
            startWatching();
        }
        
        iniciarGPS();
        
    } else {
        document.getElementById("status").innerHTML = "⚠️ GPS no disponible - Mapa solo lectura";
    }
});