"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Trade extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Trade.belongsTo(models.User, { foreignKey: "UserId" });
      Trade.belongsTo(models.Commodity, { foreignKey: "CommodityId" });
    }
  }
  Trade.init(
    {
      UserId: DataTypes.INTEGER,
      CommodityId: DataTypes.INTEGER,
      buyPrice: DataTypes.FLOAT,
      sellPrice: DataTypes.FLOAT,
      averagePrice: DataTypes.FLOAT,
      amount: DataTypes.FLOAT,
      quantity: DataTypes.FLOAT,
      realised: DataTypes.FLOAT,
      realisedAmount: DataTypes.FLOAT,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Trade",
    }
  );
  return Trade;
};
