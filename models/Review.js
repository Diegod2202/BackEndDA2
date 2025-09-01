'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    static associate(models) {
      // Review belongs to Usuario
      Review.belongsTo(models.Usuario, {
        foreignKey: 'idUsuario',
        as: 'usuario'
      });

      // Review belongs to Pelicula
      Review.belongsTo(models.Pelicula, {
        foreignKey: 'idPelicula',
        as: 'pelicula'
      });

      // Review has many Likes
      Review.hasMany(models.Like, {
        foreignKey: 'idReview',
        as: 'likes'
      });

      // Review has many Comentarios
      Review.hasMany(models.Comentario, {
        foreignKey: 'idReview',
        as: 'comentarios'
      });
    }
  }

  Review.init({
    idReview: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    idUsuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usuarios',
        key: 'idUsuario'
      }
    },
    idPelicula: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'peliculas',
        key: 'idPelicula'
      }
    },
    calificacion: {
      type: DataTypes.FLOAT,
      allowNull: true,
      validate: {
        min: 0,
        max: 5
      }
    },
    comentario: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Review',
    tableName: 'reviews',
    timestamps: false,
    indexes: [
      {
        fields: ['idUsuario']
      },
      {
        fields: ['idPelicula']
      },
      {
        fields: ['fecha']
      },
      {
        fields: ['calificacion']
      }
    ]
  });

  return Review;
}; 