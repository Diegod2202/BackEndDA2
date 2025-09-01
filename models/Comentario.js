'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Comentario extends Model {
    static associate(models) {
      // Comentario belongs to Review
      Comentario.belongsTo(models.Review, {
        foreignKey: 'idReview',
        as: 'review'
      });

      // Comentario belongs to Usuario
      Comentario.belongsTo(models.Usuario, {
        foreignKey: 'idUsuario',
        as: 'usuario'
      });
    }
  }

  Comentario.init({
    idComentario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    idReview: {
      type: DataTypes.STRING(50),
      allowNull: false,
      references: {
        model: 'reviews',
        key: 'idReview'
      }
    },
    idUsuario: {
      type: DataTypes.STRING(50),
      allowNull: false,
      references: {
        model: 'usuarios',
        key: 'idUsuario'
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
    modelName: 'Comentario',
    tableName: 'comentarios',
    timestamps: false,
    indexes: [
      {
        fields: ['idReview']
      },
      {
        fields: ['idUsuario']
      },
      {
        fields: ['fecha']
      }
    ]
  });

  return Comentario;
}; 