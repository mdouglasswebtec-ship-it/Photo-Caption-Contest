'use strict';

module.exports = (sequelize, DataTypes) => {
  const Image = sequelize.define(
    'Image',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      filename: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
        },
      },
      url: {
        type: DataTypes.STRING(500),
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
    },
    {
      tableName: 'Images',
    }
  );

  Image.associate = (models) => {
    Image.hasMany(models.Caption, {
      foreignKey: 'imageId',
      as: 'captions',
      onDelete: 'CASCADE',
    });
  };

  return Image;
};
