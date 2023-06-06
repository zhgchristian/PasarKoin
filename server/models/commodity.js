"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Commodity extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Commodity.hasMany(models.Trade, { foreignKey: "CommodityId" });
      Commodity.belongsToMany(models.User, {
        through: models.Trade,
        foreignKey: "CommodityId",
        otherKey: "UserId",
      });
      // define association here
    }
  }
  Commodity.init(
    {
      name: DataTypes.STRING,
      interestRate: DataTypes.FLOAT,
      imageUrl: DataTypes.STRING,
      symbol: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Commodity",
    }
  );
  return Commodity;
};
