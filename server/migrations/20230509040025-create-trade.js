"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Trades", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      UserId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
      },
      CommodityId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Commodities",
          key: "id",
        },
      },
      buyPrice: {
        type: Sequelize.FLOAT,
      },
      sellPrice: {
        type: Sequelize.FLOAT,
      },
      averagePrice: {
        type: Sequelize.FLOAT,
      },
      amount: {
        type: Sequelize.FLOAT,
      },
      quantity: {
        type: Sequelize.FLOAT,
      },
      realised: {
        type: Sequelize.FLOAT,
      },
      realisedAmount: {
        type: Sequelize.FLOAT,
      },
      status: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Trades");
  },
};
