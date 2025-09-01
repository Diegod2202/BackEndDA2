const express = require('express');
const router = express.Router();
const { Pelicula, Visita } = require('../models');
const { Op } = require('sequelize');

// POST /api/peliculas/evento - Handle movie events
router.post('/evento', async (req, res) => {
  try {
    const { evento, idPelicula, titulo, genero, duracion, fechaEstreno, plataformas, idUsuario, idSesion, pagina, fecha } = req.body;

    switch (evento) {
      case 'pelicula_creada':
        await Pelicula.create({
          titulo,
          genero: Array.isArray(genero) ? genero.join(', ') : genero,
          duracion,
          fechaEstreno: new Date(fechaEstreno),
          plataformas: Array.isArray(plataformas) ? plataformas.join(', ') : plataformas
        });
        break;

      case 'pelicula_buscada':
        // This could be logged to a separate search log table
        // For now, we'll just acknowledge it
        break;

      case 'pagina_vista':
        await Visita.create({
          idSesion,
          pagina,
          idPelicula,
          fecha: new Date(fecha)
        });
        break;

      default:
        return res.status(400).json({ error: 'Evento no reconocido' });
    }

    res.json({ success: true, message: `Evento ${evento} procesado correctamente` });
  } catch (error) {
    console.error('Error procesando evento de película:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/peliculas - Get all movies
router.get('/', async (req, res) => {
  try {
    const peliculas = await Pelicula.findAll({
      order: [['fechaEstreno', 'DESC']]
    });
    res.json(peliculas);
  } catch (error) {
    console.error('Error obteniendo películas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/peliculas/:id - Get movie by ID
router.get('/:id', async (req, res) => {
  try {
    const pelicula = await Pelicula.findByPk(req.params.id);
    if (!pelicula) {
      return res.status(404).json({ error: 'Película no encontrada' });
    }
    res.json(pelicula);
  } catch (error) {
    console.error('Error obteniendo película:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/peliculas/mas-vistas - Get most viewed movies
router.get('/mas-vistas', async (req, res) => {
  try {
    const { limit = 10, periodo = '30' } = req.query;
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(periodo));

    const peliculasMasVistas = await Visita.findAll({
      where: {
        fecha: {
          [Op.gte]: daysAgo
        },
        idPelicula: {
          [Op.ne]: null
        }
      },
      attributes: [
        'idPelicula',
        [Pelicula.sequelize.fn('COUNT', Pelicula.sequelize.col('idPelicula')), 'visitas']
      ],
      include: [{
        model: Pelicula,
        as: 'pelicula',
        attributes: ['titulo', 'genero']
      }],
      group: ['idPelicula'],
      order: [[Pelicula.sequelize.fn('COUNT', Pelicula.sequelize.col('idPelicula')), 'DESC']],
      limit: parseInt(limit)
    });

    res.json(peliculasMasVistas);
  } catch (error) {
    console.error('Error obteniendo películas más vistas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/peliculas/trending - Get trending movies
router.get('/trending', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - 7); // Last 7 days

    const peliculasTrending = await Visita.findAll({
      where: {
        fecha: {
          [Op.gte]: daysAgo
        },
        idPelicula: {
          [Op.ne]: null
        }
      },
      attributes: [
        'idPelicula',
        [Pelicula.sequelize.fn('COUNT', Pelicula.sequelize.col('idPelicula')), 'visitas']
      ],
      include: [{
        model: Pelicula,
        as: 'pelicula',
        attributes: ['titulo', 'genero', 'fechaEstreno']
      }],
      group: ['idPelicula'],
      order: [[Pelicula.sequelize.fn('COUNT', Pelicula.sequelize.col('idPelicula')), 'DESC']],
      limit: parseInt(limit)
    });

    res.json(peliculasTrending);
  } catch (error) {
    console.error('Error obteniendo películas trending:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router; 