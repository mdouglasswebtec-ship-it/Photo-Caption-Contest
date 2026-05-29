'use strict';

module.exports = (sequelize, DataTypes) => {
  const Caption = sequelize.define(
    'Caption',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      text: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [1, 500],
        },
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      imageId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Images',
          key: 'id',
        },
      },
    },
    {
      tableName: 'Captions',
    }
  );

  Caption.associate = (models) => {
    Caption.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
    Caption.belongsTo(models.Image, {
      foreignKey: 'imageId',
      as: 'image',
    });
  };

  return Caption;
};
