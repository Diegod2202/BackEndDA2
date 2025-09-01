const express = require('express');
const router = express.Router();
const { Review, Like, Comentario, Follow, Usuario, Pelicula } = require('../models');
const { Op } = require('sequelize');

// POST /api/reviews/evento - Handle review and social events
router.post('/evento', async (req, res) => {
  try {
    const { 
      evento, 
      idReview, 
      idUsuario, 
      idPelicula, 
      calificacion, 
      comentario, 
      fecha,
      idSeguidor,
      idSeguido
    } = req.body;

    switch (evento) {
      case 'review_creada':
        await Review.create({
          idUsuario,
          idPelicula,
          calificacion,
          comentario,
          fecha: new Date(fecha)
        });
        break;

      case 'review_eliminada':
        await Review.destroy({
          where: { idReview }
        });
        break;

      case 'like_review':
        await Like.create({
          idReview,
          idUsuario,
          fecha: new Date(fecha)
        });
        break;

      case 'comentario_review':
        await Comentario.create({
          idReview,
          idUsuario,
          comentario,
          fecha: new Date(fecha)
        });
        break;

      case 'follow_usuario':
        await Follow.create({
          idSeguidor,
          idSeguido,
          fecha: new Date(fecha)
        });
        break;

      default:
        return res.status(400).json({ error: 'Evento no reconocido' });
    }

    res.json({ success: true, message: `Evento ${evento} procesado correctamente` });
  } catch (error) {
    console.error('Error procesando evento de review:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/reviews - Get all reviews
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.findAll({
      include: [
        { model: Usuario, as: 'usuario', attributes: ['nombre'] },
        { model: Pelicula, as: 'pelicula', attributes: ['titulo'] }
      ],
      order: [['fecha', 'DESC']]
    });
    res.json(reviews);
  } catch (error) {
    console.error('Error obteniendo reviews:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/reviews/pelicula/:idPelicula - Get reviews for a specific movie
router.get('/pelicula/:idPelicula', async (req, res) => {
  try {
    const reviews = await Review.findAll({
      where: { idPelicula: req.params.idPelicula },
      include: [
        { model: Usuario, as: 'usuario', attributes: ['nombre'] },
        { model: Pelicula, as: 'pelicula', attributes: ['titulo'] }
      ],
      order: [['fecha', 'DESC']]
    });
    res.json(reviews);
  } catch (error) {
    console.error('Error obteniendo reviews de película:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/reviews/calificacion-promedio/:idPelicula - Get average rating for a movie
router.get('/calificacion-promedio/:idPelicula', async (req, res) => {
  try {
    const resultado = await Review.findOne({
      where: { idPelicula: req.params.idPelicula },
      attributes: [
        [Review.sequelize.fn('AVG', Review.sequelize.col('calificacion')), 'promedio'],
        [Review.sequelize.fn('COUNT', Review.sequelize.col('idReview')), 'totalReviews']
      ]
    });

    res.json({
      idPelicula: req.params.idPelicula,
      calificacionPromedio: parseFloat(resultado.dataValues.promedio) || 0,
      totalReviews: parseInt(resultado.dataValues.totalReviews) || 0
    });
  } catch (error) {
    console.error('Error obteniendo calificación promedio:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/reviews/usuarios-relevantes - Get most relevant users
router.get('/usuarios-relevantes', async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const usuariosRelevantes = await Usuario.findAll({
      attributes: [
        'idUsuario',
        'nombre',
        [Review.sequelize.fn('COUNT', Review.sequelize.col('reviews.idReview')), 'totalReviews'],
        [Like.sequelize.fn('COUNT', Like.sequelize.col('likes.idLike')), 'totalLikes'],
        [Comentario.sequelize.fn('COUNT', Comentario.sequelize.col('comentarios.idComentario')), 'totalComentarios']
      ],
      include: [
        {
          model: Review,
          as: 'reviews',
          attributes: []
        },
        {
          model: Like,
          as: 'likes',
          attributes: []
        },
        {
          model: Comentario,
          as: 'comentarios',
          attributes: []
        }
      ],
      group: ['Usuario.idUsuario'],
      order: [
        [Review.sequelize.fn('COUNT', Review.sequelize.col('reviews.idReview')), 'DESC'],
        [Like.sequelize.fn('COUNT', Like.sequelize.col('likes.idLike')), 'DESC']
      ],
      limit: parseInt(limit)
    });

    res.json(usuariosRelevantes);
  } catch (error) {
    console.error('Error obteniendo usuarios relevantes:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/reviews/interacciones - Get interaction statistics
router.get('/interacciones', async (req, res) => {
  try {
    const { periodo = '30' } = req.query;
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(periodo));

    const [totalLikes, totalComentarios, totalFollows] = await Promise.all([
      Like.count({
        where: {
          fecha: {
            [Op.gte]: daysAgo
          }
        }
      }),
      Comentario.count({
        where: {
          fecha: {
            [Op.gte]: daysAgo
          }
        }
      }),
      Follow.count({
        where: {
          fecha: {
            [Op.gte]: daysAgo
          }
        }
      })
    ]);

    res.json({
      periodo: `${periodo} días`,
      totalLikes,
      totalComentarios,
      totalFollows,
      totalInteracciones: totalLikes + totalComentarios + totalFollows
    });
  } catch (error) {
    console.error('Error obteniendo estadísticas de interacciones:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router; 