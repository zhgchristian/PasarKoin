"use strict";
const { Model } = require("sequelize");
const { encryptPassword } = require("../helpers/bcrypt");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Deposit, { foreignKey: "UserId" });
      User.hasMany(models.Trade, { foreignKey: "UserId" });
      User.hasMany(models.Staking, {foreignKey: 'UserId'})
      User.belongsToMany(models.Commodity, {
        through: models.Trade,
        foreignKey: "UserId",
        otherKey: "CommodityId",
      });
      // define association here
    }
  }
  User.init(
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Email cannot be empty",
          },
          notEmpty: {
            msg: "Email cannot be empty",
          },
          isEmail: {
            msg: "Invalid email format",
          },
        },
      },

      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Password cannot be empty",
          },
          notEmpty: {
            msg: "Password cannot be empty",
          },
        },
      },
      balance: DataTypes.FLOAT,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
      hooks: {
        beforeCreate: (user) => {
          user.password = encryptPassword(user.password);
        },
      },
    }
  );
  return User;
};
