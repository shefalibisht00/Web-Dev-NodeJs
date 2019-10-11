'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('MusicBands', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
        validate: {
          isAlpa: true, 
          len: [3, 20]
        }
      },
      genre: {
        allowNull: false,
        type: Sequelize.STRING,
        validate: {
          isAlpa: true, 
          len: [3, 20]
        }
      },
      userId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        references: {         // Reference to Users table
          model: 'Users'
        }
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('MusicBands');
  }
};