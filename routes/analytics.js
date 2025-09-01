const express = require('express');
const router = express.Router();
const { 
  Usuario, 
  Pelicula, 
  Review, 
  Like, 
  Comentario, 
  Follow, 
  Sesion, 
  Visita 
} = require('../models');
const { Op, fn, col, literal } = require('sequelize');

// GET /api/analytics/dashboard - Get comprehensive dashboard data
router.get('/dashboard', async (req, res) => {
  try {
    const { periodo = '30' } = req.query;
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(periodo));

    // Get all metrics in parallel
    const [
      totalUsuarios,
      nuevosUsuarios,
      usuariosActivos,
      totalPeliculas,
      totalReviews,
      calificacionPromedio,
      totalInteracciones,
      tiempoPromedioSesion,
      paginasPorSesion,
      dispositivosUsados,
      peliculasMasValoradas,
      crecimientoRed
    ] = await Promise.all([
      // Total users
      Usuario.count(),
      
      // New users in period
      Usuario.count({
        where: {
          fechaRegistro: {
            [Op.gte]: daysAgo
          }
        }
      }),
      
      // Active users in period
      Sesion.count({
        where: {
          fechaInicio: {
            [Op.gte]: daysAgo
          },
          idUsuario: {
            [Op.ne]: null
          }
        },
        distinct: true,
        col: 'idUsuario'
      }),
      
      // Total movies
      Pelicula.count(),
      
      // Total reviews
      Review.count(),
      
      // Average rating
      Review.findOne({
        attributes: [
          [fn('AVG', col('calificacion')), 'promedio']
        ]
      }),
      
      // Total interactions
      Promise.all([
        Like.count(),
        Comentario.count(),
        Follow.count()
      ]).then(([likes, comentarios, follows]) => likes + comentarios + follows),
      
      // Average session time
      Sesion.findOne({
        where: {
          fechaFin: {
            [Op.ne]: null
          }
        },
        attributes: [
          [fn('AVG', fn('TIMESTAMPDIFF', literal('MINUTE'), col('fechaInicio'), col('fechaFin'))), 'tiempoPromedio']
        ]
      }),
      
      // Pages per session
      Visita.findAll({
        attributes: [
          'idSesion',
          [fn('COUNT', col('idVisita')), 'paginas']
        ],
        group: ['idSesion']
      }).then(visitas => {
        const totalPaginas = visitas.reduce((sum, visita) => sum + parseInt(visita.dataValues.paginas), 0);
        const totalSesiones = visitas.length;
        return totalSesiones > 0 ? totalPaginas / totalSesiones : 0;
      }),
      
      // Device usage
      Sesion.findAll({
        attributes: [
          'dispositivo',
          [fn('COUNT', col('idSesion')), 'total']
        ],
        group: ['dispositivo']
      }),
      
      // Best rated movies
      Review.findAll({
        attributes: [
          'idPelicula',
          [fn('AVG', col('calificacion')), 'calificacionPromedio'],
          [fn('COUNT', col('idReview')), 'totalReviews']
        ],
        include: [{
          model: Pelicula,
          as: 'pelicula',
          attributes: ['titulo', 'genero']
        }],
        group: ['idPelicula'],
        having: literal('COUNT(idReview) >= 5'),
        order: [[fn('AVG', col('calificacion')), 'DESC']],
        limit: 10
      }),
      
      // Network growth
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
      metricas: {
        usuarios: {
          total: totalUsuarios,
          nuevos: nuevosUsuarios,
          activos: usuariosActivos
        },
        contenido: {
          totalPeliculas,
          totalReviews,
          calificacionPromedio: parseFloat(calificacionPromedio?.dataValues?.promedio) || 0
        },
        interacciones: {
          total: totalInteracciones,
          crecimientoRed
        },
        sesiones: {
          tiempoPromedio: parseFloat(tiempoPromedioSesion?.dataValues?.tiempoPromedio) || 0,
          paginasPorSesion: paginasPorSesion || 0
        },
        dispositivos: dispositivosUsados,
        peliculasMasValoradas
      }
    });
  } catch (error) {
    console.error('Error obteniendo datos del dashboard:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/analytics/usuarios-activos - Get active users metrics (DAU, WAU, MAU)
router.get('/usuarios-activos', async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));
    
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const [dau, wau, mau] = await Promise.all([
      // Daily Active Users
      Sesion.count({
        where: {
          fechaInicio: {
            [Op.between]: [startOfDay, endOfDay]
          },
          idUsuario: {
            [Op.ne]: null
          }
        },
        distinct: true,
        col: 'idUsuario'
      }),
      
      // Weekly Active Users
      Sesion.count({
        where: {
          fechaInicio: {
            [Op.gte]: startOfWeek
          },
          idUsuario: {
            [Op.ne]: null
          }
        },
        distinct: true,
        col: 'idUsuario'
      }),
      
      // Monthly Active Users
      Sesion.count({
        where: {
          fechaInicio: {
            [Op.gte]: startOfMonth
          },
          idUsuario: {
            [Op.ne]: null
          }
        },
        distinct: true,
        col: 'idUsuario'
      })
    ]);

    res.json({
      fecha: startOfDay.toISOString().split('T')[0],
      dau,
      wau,
      mau
    });
  } catch (error) {
    console.error('Error obteniendo usuarios activos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/analytics/tasa-conversion - Get conversion rate metrics
router.get('/tasa-conversion', async (req, res) => {
  try {
    const { periodo = '30' } = req.query;
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(periodo));

    // Get total visitors (anonymous sessions)
    const visitantesAnonimos = await Sesion.count({
      where: {
        fechaInicio: {
          [Op.gte]: daysAgo
        },
        idUsuario: null
      }
    });

    // Get new registrations in the same period
    const nuevosRegistros = await Usuario.count({
      where: {
        fechaRegistro: {
          [Op.gte]: daysAgo
        }
      }
    });

    const tasaConversion = visitantesAnonimos > 0 
      ? (nuevosRegistros / visitantesAnonimos * 100).toFixed(2)
      : 0;

    res.json({
      periodo: `${periodo} días`,
      visitantesAnonimos,
      nuevosRegistros,
      tasaConversion: `${tasaConversion}%`
    });
  } catch (error) {
    console.error('Error obteniendo tasa de conversión:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/analytics/peliculas-genero - Get movies by genre insights
router.get('/peliculas-genero', async (req, res) => {
  try {
    const peliculasPorGenero = await Review.findAll({
      attributes: [
        [fn('AVG', col('calificacion')), 'calificacionPromedio'],
        [fn('COUNT', col('idReview')), 'totalReviews']
      ],
      include: [{
        model: Pelicula,
        as: 'pelicula',
        attributes: ['genero']
      }],
      group: ['pelicula.genero'],
      order: [[fn('AVG', col('calificacion')), 'DESC']]
    });

    res.json(peliculasPorGenero);
  } catch (error) {
    console.error('Error obteniendo insights por género:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/analytics/crecimiento-semanal - Get weekly growth metrics
router.get('/crecimiento-semanal', async (req, res) => {
  try {
    const { semanas = '4' } = req.query;
    const semanasAtras = parseInt(semanas);
    const datos = [];

    for (let i = 0; i < semanasAtras; i++) {
      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - (startOfWeek.getDay() + (i * 7)));
      startOfWeek.setHours(0, 0, 0, 0);
      
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);

      const [nuevosUsuarios, nuevasReviews, nuevasInteracciones] = await Promise.all([
        Usuario.count({
          where: {
            fechaRegistro: {
              [Op.between]: [startOfWeek, endOfWeek]
            }
          }
        }),
        Review.count({
          where: {
            fecha: {
              [Op.between]: [startOfWeek, endOfWeek]
            }
          }
        }),
        Promise.all([
          Like.count({
            where: {
              fecha: {
                [Op.between]: [startOfWeek, endOfWeek]
              }
            }
          }),
          Comentario.count({
            where: {
              fecha: {
                [Op.between]: [startOfWeek, endOfWeek]
              }
            }
          }),
          Follow.count({
            where: {
              fecha: {
                [Op.between]: [startOfWeek, endOfWeek]
              }
            }
          })
        ]).then(([likes, comentarios, follows]) => likes + comentarios + follows)
      ]);

      datos.push({
        semana: `Semana ${semanasAtras - i}`,
        fechaInicio: startOfWeek.toISOString().split('T')[0],
        fechaFin: endOfWeek.toISOString().split('T')[0],
        nuevosUsuarios,
        nuevasReviews,
        nuevasInteracciones
      });
    }

    res.json(datos.reverse());
  } catch (error) {
    console.error('Error obteniendo crecimiento semanal:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router; 