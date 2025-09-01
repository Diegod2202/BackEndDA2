// Script para poblar la base de datos MySQL con datos de ejemplo
const { Usuario, Pelicula, Review, sequelize } = require('../models');

async function seed() {
  try {
  await sequelize.sync({ force: true }); // Borra y crea tablas

    // Usuarios
    const usuarios = await Usuario.bulkCreate([
      { nombre: 'Juan', email: 'juan@example.com', password: '123456' },
      { nombre: 'Ana', email: 'ana@example.com', password: 'abcdef' }
    ]);

    // Películas
    const peliculas = await Pelicula.bulkCreate([
      { titulo: 'Matrix', descripcion: 'Ciencia ficción', anio: 1999 },
      { titulo: 'Inception', descripcion: 'Sueños', anio: 2010 }
    ]);

    // Reviews
    await Review.bulkCreate([
      { comentario: 'Excelente', rating: 5, UsuarioId: usuarios[0].id, PeliculaId: peliculas[0].id },
      { comentario: 'Muy buena', rating: 4, UsuarioId: usuarios[1].id, PeliculaId: peliculas[1].id }
    ]);

    console.log('Datos de ejemplo cargados correctamente.');
    process.exit();
  } catch (error) {
    console.error('Error al cargar datos:', error);
    process.exit(1);
  }
}

seed();
