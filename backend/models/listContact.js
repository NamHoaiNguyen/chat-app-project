'use strict';
module.exports = (sequelize, DataTypes) => {
  const ListContact = sequelize.define("ListContact", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,

    },
    listFriendId: {
      type: DataTypes.UUID,
      allowNull: false,
      
    }
  },{schema: 'chatapp'});

  return ListContact;
};
