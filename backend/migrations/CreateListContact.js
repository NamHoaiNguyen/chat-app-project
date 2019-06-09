'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('ListContact', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,

      },
      friendId: {
        type: Sequelize.UUID,
        allowNull: false,

      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },


    }, {schema: 'chatapp'})
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('ListContact');
  }
};
