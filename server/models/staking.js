'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Staking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Staking.belongsTo(models.User, {foreignKey: 'UserId'})
      // define association here
    }
  }
  Staking.init({
    UserId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    status: DataTypes.STRING,
    amount: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'Staking',
  });
  return Staking;
};