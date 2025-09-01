'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Visita extends Model {
    static associate(models) {
      // Visita belongs to Sesion
      Visita.belongsTo(models.Sesion, {
        foreignKey: 'idSesion',
        as: 'sesion'
      });

      // Visita belongs to Pelicula (optional)
      Visita.belongsTo(models.Pelicula, {
        foreignKey: 'idPelicula',
        as: 'pelicula'
      });
    }
  }

  Visita.init({
    idVisita: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    idSesion: {
      type: DataTypes.STRING(50),
      allowNull: false,
      references: {
        model: 'sesiones',
        key: 'idSesion'
      }
    },
    pagina: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    idPelicula: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'peliculas',
        key: 'idPelicula'
      }
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Visita',
    tableName: 'visitas',
    timestamps: false,
    indexes: [
      {
        fields: ['idSesion']
      },
      {
        fields: ['pagina']
      },
      {
        fields: ['idPelicula']
      },
      {
        fields: ['fecha']
      }
    ]
  });

  return Visita;
}; 