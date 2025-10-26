[# 🏃 Dromos 🏃]

[![PHP Version](https://img.shields.io/badge/PHP-8.1+-777BB4?logo=php&logoColor=white)](https://www.php.net/)
[![MySQL](https://img.shields.io/badge/MySQL-8.x-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com/)
[![License](https://img.shields.io/badge/license-CC%20BY--NC--SA%204.0-green)](LICENSE)

Aplicación web que gamifica la ocupación de territorio mediante recorridos GPS. Permite a los usuarios registrarse, capturar polígonos usando sus ubicaciones GPS, almacenar sus territorios conquistados y competir en un ranking global basado en el área total capturada.

## ✨ Características principales

- 🔐 **Autenticación completa**: Sistema de registro, inicio/cierre de sesión con protección de rutas mediante sesiones PHP
- 🗺️ **Captura de territorio**: Visualización interactiva de mapas con Leaflet, registro de puntos GPS en tiempo real
- 📐 **Cálculo de áreas**: Procesamiento de polígonos y cálculo preciso de superficies con Turf.js
- 💾 **Gestión persistente**: Almacenamiento de polígonos, puntos y áreas en MySQL mediante API REST
- 🏆 **Ranking global**: Clasificación en vivo de usuarios por área total conquistada
- 📱 **Geolocalización**: Soporte completo para GPS en navegadores modernos

## 🚀 Inicio rápido

### Requisitos previos

- PHP 8.1 o superior con extensión PDO habilitada
- Servidor web (Apache, Nginx o servidor integrado de PHP)
- MySQL 8.x o MariaDB 10.x
- Navegador moderno con soporte para geolocalización
- Composer (opcional, para dependencias futuras)

### Instalación

1. **Clonar el repositorio**

```bash
git clone https://github.com/neokey2008/dromos.git
cd dromos
```

2. **Configurar la base de datos**

Crear la base de datos:

```bash
mysql -u root -p
```

```sql
CREATE DATABASE dromos CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
exit;
```

Importar el esquema:

```bash
mysql -u root -p dromos < DB/base.sql
```

3. **Configurar credenciales**

Copiar y editar el archivo de configuración:

```bash
cp config.php config.local.php
```

Editar `config.local.php` con tus credenciales:

```php
<?php
$host = 'localhost';
$db_name = 'dromos';
$username = 'tu_usuario';
$password = 'tu_contraseña';
```

> ⚠️ **Importante**: Asegúrate de añadir `config.local.php` a tu `.gitignore` para no exponer credenciales.

4. **Iniciar el servidor**

Usando el servidor integrado de PHP:

```bash
php -S localhost:8000
```

O configurar un VirtualHost en Apache/Nginx apuntando al directorio del proyecto.

5. **Acceder a la aplicación**

Abre tu navegador en:
- Registro/Login: `http://localhost:8000/login.php`
- Mapa principal: `http://localhost:8000/index.php` (requiere autenticación)

## 📁 Estructura del proyecto

```
dromos/
├── DB/
│   └── base.sql           # Esquema de base de datos
├── api/
│   ├── auth.php           # Endpoints de autenticación
│   ├── territorios.php    # Gestión de territorios
│   └── ranking.php        # Sistema de clasificación
├── css/
│   └── styles.css         # Estilos personalizados
├── js/
│   ├── app-leaflet.js             # Lógica de Leaflet
│   ├── auth.js            # Autenticación del cliente
│   └── config-map.js          # Configuración del mapa
├── index.php              # Página principal con mapa
├── login.php              # Formulario de acceso
├── register.php           # Registro de usuarios
├── logout.php             # Cierre de sesión
├── config.php             # Configuración de BD y sesiones
├── README.md
```

## 🔌 API REST

### Autenticación (`api/auth.php`)

```http
POST /api/auth.php?action=login
Content-Type: application/json

{
  "username": "usuario",
  "password": "contraseña"
}
```

### Territorios (`api/territorios.php`)

```http
POST /api/territorios.php
Content-Type: application/json

{
  "puntos": [[lat1, lng1], [lat2, lng2], ...],
  "area": 1234.56
}
```

### Ranking (`api/ranking.php`)

```http
GET /api/ranking.php
```

Respuesta:
```json
[
  {
    "username": "usuario1",
    "total_area": 5000.50,
    "territorio_count": 12
  }
]
```

> 📝 Todos los endpoints requieren sesión activa mediante cookies PHP.

## 🛠️ Tecnologías utilizadas

- **Backend**: PHP 8.1+, MySQL 8.x
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Mapas**: [Leaflet](https://leafletjs.com/) 1.9+
- **Geometría**: [Turf.js](https://turfjs.org/) 6.5+
- **API**: REST con JSON

## 🔧 Configuración avanzada

### Variables de entorno

Para mayor seguridad, considera usar variables de entorno:

```php
// config.php
$host = getenv('DB_HOST') ?: 'localhost';
$db_name = getenv('DB_NAME') ?: 'dromos';
$username = getenv('DB_USER') ?: 'root';
$password = getenv('DB_PASS') ?: '';
```

### Docker (opcional)

```dockerfile
FROM php:8.1-apache
RUN docker-php-ext-install pdo pdo_mysql
COPY . /var/www/html/
EXPOSE 80
```

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/NuevaCaracteristica`)
3. Commit tus cambios (`git commit -m 'feat: añade nueva característica'`)
4. Push a la rama (`git push origin feature/NuevaCaracteristica`)
5. Abre un Pull Request

### Convenciones de commits

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nueva característica
- `fix:` Corrección de bug
- `docs:` Cambios en documentación
- `style:` Formato, punto y coma, etc
- `refactor:` Refactorización de código
- `test:` Añadir tests
- `chore:` Mantenimiento

## 📋 Roadmap

- [ ] Modo offline con Service Workers
- [ ] Exportación de territorios a GeoJSON/KML
- [ ] Sistema de logros y badges
- [ ] Visualización de heat maps
- [ ] API pública con autenticación JWT
- [ ] App móvil nativa (React Native/Flutter)
- [ ] Integración con wearables (Strava, Garmin)

## 🐛 Reportar problemas

Si encuentras un bug, por favor [abre un issue](https://github.com/neokey2008/dromos/issues) con:
- Descripción del problema
- Pasos para reproducirlo
- Comportamiento esperado vs actual
- Screenshots (si aplica)
- Entorno (navegador, versión PHP, etc)

## 📄 Licencia

[![License](https://img.shields.io/badge/license-CC%20BY--NC--SA%204.0-green)](LICENSE)

## 🪪 Política de atribución

Si reutilizas este proyecto total o parcialmente (incluyendo forks, adaptaciones y publicaciones derivadas), debes:

- Mencionar explícitamente a **Miguel Angel Muñiz Landeros** como autor original.
- Incluir un enlace al repositorio original: <https://github.com/neokey2008/dromos>.
- Indicar que la obra original está licenciada bajo **CC BY-NC-SA 4.0** e incluir un enlace a la licencia.
- Señalar cualquier modificación que realices respecto a la obra original.

## 👥 Autores

- **Miguel Angel Muñiz Landeros** - *Desarrollo inicial* - [@neokey2008](https://github.com/neokey2008)

## 🙏 Agradecimientos

- Leaflet por su excelente biblioteca de mapas
- Turf.js por las operaciones geoespaciales
- OpenStreetMap por los datos cartográficos

---

<div align="center">

**[Documentación](https://github.com/neokey2008/dromos/wiki)** • 
**[Reportar Bug](https://github.com/neokey2008/dromos/issues)** • 
**[Solicitar Feature](https://github.com/neokey2008/dromos/issues)**

Hecho con ❤️ para la comunidad de exploradores urbanos

</div>]
