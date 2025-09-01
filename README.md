# Analytics & Insights Module

Este módulo proporciona análisis y métricas para la plataforma de películas, incluyendo tracking de usuarios, interacciones, reviews y KPIs de negocio.

## 🚀 Características

- **Tracking de Eventos**: Procesamiento de eventos JSON desde otros módulos
- **Métricas de Usuarios**: DAU, WAU, MAU, usuarios activos, nuevos registros
- **Análisis de Contenido**: Películas más vistas, trending, calificaciones promedio
- **Métricas Sociales**: Likes, comentarios, follows, usuarios más relevantes
- **KPIs de Negocio**: Tasa de conversión, tiempo en sesión, dispositivos usados
- **Dashboard Completo**: API endpoints para todas las métricas principales

## 📊 Base de Datos

### Tablas Principales

- **usuarios**: Información de usuarios registrados
- **peliculas**: Catálogo de películas
- **reviews**: Reseñas y calificaciones
- **likes**: Likes en reviews
- **comentarios**: Comentarios en reviews
- **follows**: Relaciones de seguimiento entre usuarios
- **sesiones**: Sesiones de usuario
- **visitas**: Tracking de navegación

## 🛠️ Instalación

### Prerrequisitos

- Node.js (v14 o superior)
- MySQL (v8.0 o superior)
- npm o yarn

### Configuración

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd analytics-insights-backend
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar base de datos**
```bash
# Crear archivo .env basado en .env.example
cp .env.example .env

# Editar variables de entorno
DB_HOST=localhost
DB_PORT=3306
DB_NAME=analytics_insights
DB_USER=root
DB_PASSWORD=your_password
```

4. **Crear base de datos**
```sql
CREATE DATABASE analytics_insights;
```

5. **Ejecutar migraciones**
```bash
npm run db:migrate
```

6. **Iniciar servidor**
```bash
# Desarrollo
npm run dev

# Producción
npm start
```

## 📡 API Endpoints

### Eventos

#### Usuarios
```http
POST /api/usuarios/evento
Content-Type: application/json

{
  "evento": "usuario_creado",
  "idUsuario": "u123",
  "nombre": "Juan Pérez",
  "pais": "AR",
  "fechaRegistro": "2025-08-20"
}
```

#### Películas
```http
POST /api/peliculas/evento
Content-Type: application/json

{
  "evento": "pelicula_creada",
  "idPelicula": "p456",
  "titulo": "Inception",
  "genero": ["Sci-Fi", "Thriller"],
  "duracion": 148,
  "fechaEstreno": "2010-07-16",
  "plataformas": ["Netflix", "HBO Max"]
}
```

#### Reviews & Social
```http
POST /api/reviews/evento
Content-Type: application/json

{
  "evento": "review_creada",
  "idReview": "r789",
  "idUsuario": "u123",
  "idPelicula": "p456",
  "calificacion": 4.5,
  "comentario": "Excelente película",
  "fecha": "2025-08-21"
}
```

### Métricas

#### Dashboard Completo
```http
GET /api/analytics/dashboard?periodo=30
```

#### Usuarios Activos
```http
GET /api/analytics/usuarios-activos
```

#### Tasa de Conversión
```http
GET /api/analytics/tasa-conversion?periodo=30
```

#### Películas Trending
```http
GET /api/peliculas/trending?limit=10
```

#### Usuarios Más Relevantes
```http
GET /api/reviews/usuarios-relevantes?limit=10
```

## 📈 Métricas Disponibles

### Actividad de Usuarios
- **DAU/WAU/MAU**: Usuarios activos diarios, semanales y mensuales
- **Nuevos Registros**: Usuarios que se registran en un período
- **Usuarios Relevantes**: Top usuarios por reviews, likes e interacciones

### Interacción con Películas
- **Películas Más Vistas**: Ranking por visitas
- **Trending**: Películas con picos recientes de actividad
- **Calificación Promedio**: Por película y género

### Comunidad y Red Social
- **Interacciones**: Likes, comentarios, follows
- **Crecimiento de Red**: Nuevos follows por semana
- **Engagement**: Métricas de participación

### KPIs de Negocio
- **Tasa de Conversión**: Visitantes → Registros
- **Tiempo en Sesión**: Promedio por sesión
- **Páginas por Sesión**: Engagement de navegación
- **Dispositivos**: Desktop vs Mobile

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Producción
npm start

# Base de datos
npm run db:migrate    # Ejecutar migraciones
npm run db:seed       # Poblar con datos de prueba
npm run db:reset      # Resetear base de datos
```

## 🏗️ Estructura del Proyecto

```
├── config/
│   └── database.js          # Configuración de base de datos
├── models/
│   ├── index.js             # Inicialización de Sequelize
│   ├── Usuario.js           # Modelo de usuarios
│   ├── Pelicula.js          # Modelo de películas
│   ├── Review.js            # Modelo de reviews
│   ├── Like.js              # Modelo de likes
│   ├── Comentario.js        # Modelo de comentarios
│   ├── Follow.js            # Modelo de follows
│   ├── Sesion.js            # Modelo de sesiones
│   └── Visita.js            # Modelo de visitas
├── routes/
│   ├── usuarios.js          # Rutas de usuarios
│   ├── peliculas.js         # Rutas de películas
│   ├── reviews.js           # Rutas de reviews
│   └── analytics.js         # Rutas de analytics
├── index.js                 # Servidor principal
├── package.json             # Dependencias
└── README.md               # Documentación
```

## 🔒 Seguridad

- **Helmet**: Headers de seguridad
- **CORS**: Configuración de origen cruzado
- **Rate Limiting**: Límite de requests por IP
- **Validación**: Validación de datos de entrada

## 📝 Logs

El sistema registra:
- Eventos procesados
- Errores de base de datos
- Métricas de rendimiento
- Requests de API

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🆘 Soporte

Para soporte técnico, contactar al equipo de desarrollo o crear un issue en el repositorio. 