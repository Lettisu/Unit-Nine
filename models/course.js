'use strict';

module.exports = (sequelize, DataTypes) => {

  const Course = sequelize.define('Course', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIcrement: true
    },
    title: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Title is required'
        }
      },
    },
    description: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Description is required'
        }
      },
    },
    estimatedTime: {
      type: DataTypes.STRING,
      allowNull: true,
      //DataType
    },
    materialsNeeded: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  }, {});
  Course.associate = (models) => {
    models.Course.belongsTo(models.User, {
      as: 'user',
      foreignKey: {
        fieldName: 'userId',
        allowNull: false,
      },
    });
  };

  return Course;
};