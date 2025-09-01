'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('visitas', {
      idVisita: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      idSesion: {
        type: Sequelize.STRING(50),
        allowNull: false,
        references: {
          model: 'sesiones',
          key: 'idSesion'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      pagina: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      idPelicula: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'peliculas',
          key: 'idPelicula'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      fecha: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });

    // Add indexes
    await queryInterface.addIndex('visitas', ['idSesion']);
    await queryInterface.addIndex('visitas', ['pagina']);
    await queryInterface.addIndex('visitas', ['idPelicula']);
    await queryInterface.addIndex('visitas', ['fecha']);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('visitas');
  }
};
