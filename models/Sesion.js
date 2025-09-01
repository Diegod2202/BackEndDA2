'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Sesion extends Model {
    static associate(models) {
      // Sesion belongs to Usuario
      Sesion.belongsTo(models.Usuario, {
        foreignKey: 'idUsuario',
        as: 'usuario'
      });

      // Sesion has many Visitas
      Sesion.hasMany(models.Visita, {
        foreignKey: 'idSesion',
        as: 'visitas'
      });
    }
  }

  Sesion.init({
    idSesion: {
      type: DataTypes.STRING(50),
      primaryKey: true,
      allowNull: false
    },
    idUsuario: {
      type: DataTypes.STRING(50),
      allowNull: true, // Can be null for anonymous sessions
      references: {
        model: 'usuarios',
        key: 'idUsuario'
      }
    },
    dispositivo: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    fechaInicio: {
      type: DataTypes.DATE,
      allowNull: true
    },
    fechaFin: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Sesion',
    tableName: 'sesiones',
    timestamps: false,
    indexes: [
      {
        fields: ['idUsuario']
      },
      {
        fields: ['dispositivo']
      },
      {
        fields: ['fechaInicio']
      },
      {
        fields: ['fechaFin']
      }
    ]
  });

  return Sesion;
}; 