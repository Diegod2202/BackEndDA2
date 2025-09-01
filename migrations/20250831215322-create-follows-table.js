'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('follows', {
      idFollow: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      idSeguidor: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'usuarios',
          key: 'idUsuario'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      idSeguido: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'usuarios',
          key: 'idUsuario'
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
    await queryInterface.addIndex('follows', ['idSeguidor']);
    await queryInterface.addIndex('follows', ['idSeguido']);
    await queryInterface.addIndex('follows', ['fecha']);
    
    // Add unique constraint to prevent duplicate follows
    await queryInterface.addIndex('follows', ['idSeguidor', 'idSeguido'], {
      unique: true,
      name: 'follows_unique_follower_followed'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('follows');
  }
};
