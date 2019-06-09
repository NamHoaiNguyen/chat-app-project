'use strict';
module.exports = (sequelize, DataTypes) => {
    var User = sequelize.define('User', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        createdAt: {
            allowNull: false,
            type: DataTypes.DATE
        },
        updatedAt: {
            allowNull: false,
            type: DataTypes.DATE
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        }, email: {
            allowNull: false,
            type: DataTypes.STRING,
        }, password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        age: {
           type: DataTypes.INTEGER
        },
        city: {
           type: DataTypes.STRING
        },
        gender: {
          type: DataTypes.ENUM("F", "M")
        }
    },{schema: 'chatapp'});

    return User;
};
