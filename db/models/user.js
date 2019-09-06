'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false, // disallow null
      validate: {
        // is: ["^[a-z]+$", 'i'],  //Allow non-numeric characters only
        notEmpty: {
          msg: "Please enter a valid first name - non-numeric characters only."
        }
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        // is:["^[a-z]+$", 'i'], //Allow non-numeric characters only
        notEmpty: {
          msg: "Please enter a valid last name - non-numeric characters only."
        }
      }
    },
    emailAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        //is: (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(myForm.emailAddr.value)),
        isEmail: {
          msg: "Please provide a valid email address - (e.g. mysite@ourearth.com)"
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        //is: /^[A-Za-z]\w{7,14}$/
        isNumeric: {
          msg: 'Please enter a password between 7 to 15 characters which contain at least one numeric digit and a special character.'
        }
      }
    }
  });
  User.associate = (models) => {
    models.User.hasMany(models.Course, {
      as: "user",
      foreignKey: {
        fieldName: 'userId',
        allowNull: false,
      },
    });
  }
  return User;
};