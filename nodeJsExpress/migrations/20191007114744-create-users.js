'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
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
          isAlpha: true, 
          len: [2, 20]
        }
      },
      company: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      dob: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true,
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING,
        validate: {
          len: [3, 10]
        }
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Users');
  }
};
