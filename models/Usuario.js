'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Usuario extends Model {
    static associate(models) {
      // Usuario has many Reviews
      Usuario.hasMany(models.Review, {
        foreignKey: 'idUsuario',
        as: 'reviews'
      });

      // Usuario has many Likes
      Usuario.hasMany(models.Like, {
        foreignKey: 'idUsuario',
        as: 'likes'
      });

      // Usuario has many Comentarios
      Usuario.hasMany(models.Comentario, {
        foreignKey: 'idUsuario',
        as: 'comentarios'
      });

      // Usuario has many Sesiones
      Usuario.hasMany(models.Sesion, {
        foreignKey: 'idUsuario',
        as: 'sesiones'
      });

      // Usuario has many Visitas
      Usuario.hasMany(models.Visita, {
        foreignKey: 'idUsuario',
        as: 'visitas'
      });

      // Follows relationships
      Usuario.hasMany(models.Follow, {
        foreignKey: 'idSeguidor',
        as: 'following'
      });

      Usuario.hasMany(models.Follow, {
        foreignKey: 'idSeguido',
        as: 'followers'
      });
    }
  }

  Usuario.init({
    idUsuario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    pais: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    fechaRegistro: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Usuario',
    tableName: 'usuarios',
    timestamps: false,
    indexes: [
      {
        fields: ['pais']
      },
      {
        fields: ['fechaRegistro']
      }
    ]
  });

  return Usuario;
}; 