const express = require('express');
const router = express.Router();
const { Usuario, Sesion } = require('../models');
const { Op } = require('sequelize');

// POST /api/usuarios/evento - Handle user events
router.post('/evento', async (req, res) => {
  try {
    const { evento, idUsuario, nombre, pais, fechaRegistro, idSesion, dispositivo, fechaInicio, fechaFin } = req.body;

    switch (evento) {
      case 'usuario_creado':
        await Usuario.create({
          nombre,
          pais,
          fechaRegistro: new Date(fechaRegistro)
        });
        break;

      case 'sesion_iniciada':
        await Sesion.create({
          idSesion,
          idUsuario,
          dispositivo,
          fechaInicio: new Date(fechaInicio)
        });
        break;

      case 'sesion_finalizada':
        await Sesion.update(
          { fechaFin: new Date(fechaFin) },
          { 
            where: { 
              idSesion,
              idUsuario 
            } 
          }
        );
        break;

      default:
        return res.status(400).json({ error: 'Evento no reconocido' });
    }

    res.json({ success: true, message: `Evento ${evento} procesado correctamente` });
  } catch (error) {
    console.error('Error procesando evento de usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/usuarios - Get all users
router.get('/', async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      order: [['fechaRegistro', 'DESC']]
    });
    res.json(usuarios);
  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/usuarios/:id - Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(usuario);
  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/usuarios/activos/diarios - Get daily active users
router.get('/activos/diarios', async (req, res) => {
  try {
    const { fecha } = req.query;
    const targetDate = fecha ? new Date(fecha) : new Date();
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

    const usuariosActivos = await Sesion.findAll({
      where: {
        fechaInicio: {
          [Op.between]: [startOfDay, endOfDay]
        },
        idUsuario: {
          [Op.ne]: null
        }
      },
      attributes: ['idUsuario'],
      group: ['idUsuario']
    });

    res.json({
      fecha: startOfDay.toISOString().split('T')[0],
      usuariosActivos: usuariosActivos.length,
      usuarios: usuariosActivos.map(u => u.idUsuario)
    });
  } catch (error) {
    console.error('Error obteniendo usuarios activos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router; 