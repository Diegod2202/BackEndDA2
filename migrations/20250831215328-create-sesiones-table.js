'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('sesiones', {
      idSesion: {
        type: Sequelize.STRING(50),
        primaryKey: true,
        allowNull: false
      },
      idUsuario: {
        type: Sequelize.INTEGER,
        allowNull: true, // Can be null for anonymous sessions
        references: {
          model: 'usuarios',
          key: 'idUsuario'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      dispositivo: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      fechaInicio: {
        type: Sequelize.DATE,
        allowNull: true
      },
      fechaFin: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });

    // Add indexes
    await queryInterface.addIndex('sesiones', ['idUsuario']);
    await queryInterface.addIndex('sesiones', ['dispositivo']);
    await queryInterface.addIndex('sesiones', ['fechaInicio']);
    await queryInterface.addIndex('sesiones', ['fechaFin']);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('sesiones');
  }
};
