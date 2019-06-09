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
        type: DataTypes.UUID,
        allowNull: false,

      },
      friendId: {
        type: DataTypes.UUID,
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
