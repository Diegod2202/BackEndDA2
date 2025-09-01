'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Follow extends Model {
    static associate(models) {
      // Follow belongs to Usuario (seguidor)
      Follow.belongsTo(models.Usuario, {
        foreignKey: 'idSeguidor',
        as: 'seguidor'
      });

      // Follow belongs to Usuario (seguido)
      Follow.belongsTo(models.Usuario, {
        foreignKey: 'idSeguido',
        as: 'seguido'
      });
    }
  }

  Follow.init({
    idFollow: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    idSeguidor: {
      type: DataTypes.STRING(50),
      allowNull: false,
      references: {
        model: 'usuarios',
        key: 'idUsuario'
      }
    },
    idSeguido: {
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
    modelName: 'Follow',
    tableName: 'follows',
    timestamps: false,
    indexes: [
      {
        fields: ['idSeguidor']
      },
      {
        fields: ['idSeguido']
      },
      {
        fields: ['fecha']
      },
      {
        unique: true,
        fields: ['idSeguidor', 'idSeguido']
      }
    ]
  });

  return Follow;
}; 