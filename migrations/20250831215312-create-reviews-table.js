'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('reviews', {
      idReview: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
      },
      idUsuario: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'usuarios',
          key: 'idUsuario'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      idPelicula: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'peliculas',
          key: 'idPelicula'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      calificacion: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      comentario: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      fecha: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });

    // Add indexes
    await queryInterface.addIndex('reviews', ['idUsuario']);
    await queryInterface.addIndex('reviews', ['idPelicula']);
    await queryInterface.addIndex('reviews', ['fecha']);
    await queryInterface.addIndex('reviews', ['calificacion']);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('reviews');
  }
};
