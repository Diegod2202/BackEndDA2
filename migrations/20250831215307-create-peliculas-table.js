'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('peliculas', {
      idPelicula: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
      },
      titulo: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      genero: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      duracion: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      fechaEstreno: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      plataformas: {
        type: Sequelize.STRING(50),
        allowNull: true
      }
    });

    // Add indexes
    await queryInterface.addIndex('peliculas', ['genero']);
    await queryInterface.addIndex('peliculas', ['fechaEstreno']);
    await queryInterface.addIndex('peliculas', ['titulo']);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('peliculas');
  }
};
