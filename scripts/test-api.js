const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

// Test data
const testEvents = {
  usuario: {
    evento: "usuario_creado",
    idUsuario: "test_user_001",
    nombre: "Usuario de Prueba",
    pais: "ES",
    fechaRegistro: "2025-01-25"
  },
  pelicula: {
    evento: "pelicula_creada",
    idPelicula: "test_movie_001",
    titulo: "Película de Prueba",
    genero: ["Drama", "Comedia"],
    duracion: 120,
    fechaEstreno: "2024-12-01",
    plataformas: ["Netflix"]
  },
  review: {
    evento: "review_creada",
    idReview: "test_review_001",
    idUsuario: "test_user_001",
    idPelicula: "test_movie_001",
    calificacion: 4.0,
    comentario: "Excelente película de prueba",
    fecha: "2025-01-25"
  }
};

async function testAPI() {
  console.log('🚀 Iniciando pruebas de la API de Analytics & Insights\n');

  try {
    // Test 1: Health check
    console.log('1. Verificando estado del servidor...');
    const health = await axios.get(`${BASE_URL.replace('/api', '')}/health`);
    console.log('✅ Servidor funcionando:', health.data.status);
    console.log('');

    // Test 2: Crear usuario
    console.log('2. Creando usuario de prueba...');
    await axios.post(`${BASE_URL}/usuarios/evento`, testEvents.usuario);
    console.log('✅ Usuario creado exitosamente');
    console.log('');

    // Test 3: Crear película
    console.log('3. Creando película de prueba...');
    await axios.post(`${BASE_URL}/peliculas/evento`, testEvents.pelicula);
    console.log('✅ Película creada exitosamente');
    console.log('');

    // Test 4: Crear review
    console.log('4. Creando review de prueba...');
    await axios.post(`${BASE_URL}/reviews/evento`, testEvents.review);
    console.log('✅ Review creada exitosamente');
    console.log('');

    // Test 5: Obtener dashboard
    console.log('5. Obteniendo datos del dashboard...');
    const dashboard = await axios.get(`${BASE_URL}/analytics/dashboard`);
    console.log('✅ Dashboard obtenido:');
    console.log('   - Total usuarios:', dashboard.data.metricas.usuarios.total);
    console.log('   - Total películas:', dashboard.data.metricas.contenido.totalPeliculas);
    console.log('   - Total reviews:', dashboard.data.metricas.contenido.totalReviews);
    console.log('');

    // Test 6: Obtener usuarios activos
    console.log('6. Obteniendo usuarios activos...');
    const usuariosActivos = await axios.get(`${BASE_URL}/analytics/usuarios-activos`);
    console.log('✅ Usuarios activos:');
    console.log('   - DAU:', usuariosActivos.data.dau);
    console.log('   - WAU:', usuariosActivos.data.wau);
    console.log('   - MAU:', usuariosActivos.data.mau);
    console.log('');

    // Test 7: Obtener películas trending
    console.log('7. Obteniendo películas trending...');
    const trending = await axios.get(`${BASE_URL}/peliculas/trending`);
    console.log('✅ Películas trending obtenidas:', trending.data.length);
    console.log('');

    // Test 8: Obtener usuarios relevantes
    console.log('8. Obteniendo usuarios más relevantes...');
    const usuariosRelevantes = await axios.get(`${BASE_URL}/reviews/usuarios-relevantes`);
    console.log('✅ Usuarios relevantes obtenidos:', usuariosRelevantes.data.length);
    console.log('');

    console.log('🎉 Todas las pruebas completadas exitosamente!');
    console.log('\n📊 La API está funcionando correctamente y lista para recibir eventos.');

  } catch (error) {
    console.error('❌ Error durante las pruebas:', error.message);
    if (error.response) {
      console.error('Respuesta del servidor:', error.response.data);
    }
  }
}

// Función para enviar eventos de ejemplo
async function sendSampleEvents() {
  console.log('📤 Enviando eventos de ejemplo...\n');

  const events = [
    // Usuario 2
    {
      url: `${BASE_URL}/usuarios/evento`,
      data: {
        evento: "usuario_creado",
        idUsuario: "test_user_002",
        nombre: "Ana López",
        pais: "CO",
        fechaRegistro: "2025-01-25"
      }
    },
    // Sesión
    {
      url: `${BASE_URL}/usuarios/evento`,
      data: {
        evento: "sesion_iniciada",
        idUsuario: "test_user_001",
        idSesion: "test_session_001",
        dispositivo: "mobile",
        fechaInicio: new Date().toISOString()
      }
    },
    // Like
    {
      url: `${BASE_URL}/reviews/evento`,
      data: {
        evento: "like_review",
        idReview: "test_review_001",
        idUsuario: "test_user_002",
        fecha: new Date().toISOString()
      }
    },
    // Comentario
    {
      url: `${BASE_URL}/reviews/evento`,
      data: {
        evento: "comentario_review",
        idReview: "test_review_001",
        idUsuario: "test_user_002",
        comentario: "Muy buena reseña!",
        fecha: new Date().toISOString()
      }
    },
    // Follow
    {
      url: `${BASE_URL}/reviews/evento`,
      data: {
        evento: "follow_usuario",
        idSeguidor: "test_user_002",
        idSeguido: "test_user_001",
        fecha: new Date().toISOString()
      }
    }
  ];

  for (const event of events) {
    try {
      await axios.post(event.url, event.data);
      console.log(`✅ Evento enviado: ${event.data.evento}`);
    } catch (error) {
      console.error(`❌ Error enviando evento ${event.data.evento}:`, error.message);
    }
  }

  console.log('\n📊 Eventos de ejemplo enviados. Revisa el dashboard para ver las métricas actualizadas.');
}

// Ejecutar pruebas
if (require.main === module) {
  testAPI()
    .then(() => {
      console.log('\n¿Deseas enviar eventos de ejemplo adicionales? (y/n)');
      process.stdin.once('data', (data) => {
        if (data.toString().trim().toLowerCase() === 'y') {
          sendSampleEvents();
        } else {
          console.log('👋 ¡Hasta luego!');
          process.exit(0);
        }
      });
    })
    .catch(console.error);
}

module.exports = { testAPI, sendSampleEvents }; 