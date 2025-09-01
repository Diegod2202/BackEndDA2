'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
    static associate(models) {
      // Like belongs to Review
      Like.belongsTo(models.Review, {
        foreignKey: 'idReview',
        as: 'review'
      });

      // Like belongs to Usuario
      Like.belongsTo(models.Usuario, {
        foreignKey: 'idUsuario',
        as: 'usuario'
      });
    }
  }

  Like.init({
    idLike: {
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
    fecha: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Like',
    tableName: 'likes',
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
      },
      {
        unique: true,
        fields: ['idReview', 'idUsuario']
      }
    ]
  });

  return Like;
}; 