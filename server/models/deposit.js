"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Deposit extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Deposit.belongsTo(models.User, { foreignKey: "UserId" });
    }
  }
  Deposit.init(
    {
      UserId: DataTypes.INTEGER,
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Amount cannot be empty",
          },
          notEmpty: {
            msg: "Amount cannot be empty",
          },
        },
      },
      status: DataTypes.STRING,
      paymentUrl: DataTypes.STRING,
      token: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Deposit",
    }
  );
  return Deposit;
};
