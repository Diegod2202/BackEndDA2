'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Pelicula extends Model {
    static associate(models) {
      // Pelicula has many Reviews
      Pelicula.hasMany(models.Review, {
        foreignKey: 'idPelicula',
        as: 'reviews'
      });

      // Pelicula has many Visitas
      Pelicula.hasMany(models.Visita, {
        foreignKey: 'idPelicula',
        as: 'visitas'
      });
    }
  }

  Pelicula.init({
    idPelicula: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    titulo: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    genero: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    duracion: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    fechaEstreno: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    plataformas: {
      type: DataTypes.STRING(50),
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Pelicula',
    tableName: 'peliculas',
    timestamps: false,
    indexes: [
      {
        fields: ['genero']
      },
      {
        fields: ['fechaEstreno']
      },
      {
        fields: ['titulo']
      }
    ]
  });

  return Pelicula;
}; 