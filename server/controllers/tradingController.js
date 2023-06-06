const { User, Commodity, Trade, Staking } = require("../models/index");
const sequelize = require('sequelize')
const axios = require("axios");

class TradingController {
  static async getUserData(req, res, next) {
    try {
      const { privileges } = req;
      const userInformation = await User.findByPk(+privileges.givenId);

      res.status(200).json({
        id: userInformation.id,
        email: userInformation.email,
        balance: userInformation.balance,
        status: userInformation.status,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getOpenTrades(req, res, next) {
    try {
      const { privileges } = req;

      const userOpenTrades = await Trade.findAll({
        include: {
          model: Commodity,
        },
        where: {
          UserId: +privileges.givenId,
          status: "open",
        },
        attributes: {
          include: ["id"],
        },
      });

      res.status(200).json(userOpenTrades);
    } catch (err) {
      next(err);
    }
  }

  static async getClosedTrades(req, res, next) {
    try {
      const { privileges } = req;

      const userClosedTrades = await Trade.findAll({
        include: {
          model: Commodity,
        },
        where: {
          UserId: +privileges.givenId,
          status: "closed",
        },
        attributes: {
          include: ["id"],
        },
        order: [['id','DESC']],
        limit: 10
      });

      res.status(200).json(userClosedTrades);
    } catch (err) {
      next(err);
    }
  }

  static async getCommodities(req, res, next) {
    try {
      const commodities = await Commodity.findAll();

      res.status(200).json(commodities);
    } catch (err) {
      next(err);
    }
  }

  static async getCommodityById(req, res, next) {
    try {
      const { id } = req.params;

      const findCommodity = await Commodity.findByPk(+id);

      if (!findCommodity) {
        throw new Error("NOT_FOUND");
      }

      const binanceMarket = await axios.get(
        `https://api.binance.com/api/v3/ticker/price?symbol=${findCommodity.symbol}`
      );

      const markPrice = +binanceMarket.data.price;

      const commodityInfo = {
        marketPrice: markPrice,
        commodity: findCommodity,
      };

      res.status(200).json(commodityInfo);
    } catch (err) {
      next(err);
    }
  }

  static async buyCrypto(req, res, next) {
    try {
      const { privileges } = req;
      const { CommodityId, quantity } = req.body;

      const findCommodity = await Commodity.findByPk(+CommodityId);

      if (!findCommodity) {
        throw new Error("NOT_FOUND");
      }

      if (quantity <= 0 || isNaN(quantity)) {
        throw new Error("QTY_ERROR");
      }

      const binanceMarket = await axios.get(
        `https://api.binance.com/api/v3/ticker/price?symbol=${findCommodity.symbol}`
      );

      const buyPrice = +binanceMarket.data.price;
      let buyQuantity = +quantity;
      let buyAmount = buyQuantity * buyPrice;

      const userProfile = await User.findByPk(+privileges.givenId);
      const userBalance = +userProfile.balance;

      if (userBalance <= buyAmount) {
        throw new Error("INSUFFICIENT_FUND");
      }

      const debitBalance = await User.decrement(
        {
          balance: buyAmount,
        },
        {
          where: {
            id: +privileges.givenId,
          },
        }
      );

      // find a trade where commodity as per id, status open
      const isAssetOwned = await Trade.findOne({
        where: {
          CommodityId: +CommodityId,
          status: "open",
          UserId: +privileges.givenId,
        },
        attributes: {
          include: ["id"],
        },
      });

      if (!isAssetOwned) {
        const newTrade = await Trade.create({
          UserId: +privileges.givenId,
          CommodityId: +CommodityId,
          buyPrice: buyPrice,
          quantity: buyQuantity,
          amount: buyAmount,
          averagePrice: buyPrice,
          status: "open",
        });

        res.status(201).json({
          data: newTrade,
        });
      } else {
        let existingTradeQuantity = +isAssetOwned.quantity;
        let existingAveragePrice = +isAssetOwned.averagePrice;
        let existingAmount = +isAssetOwned.amount;

        let updatedTradeAmount = buyAmount + existingAmount;
        let updatedTradeQuantity = buyQuantity + existingTradeQuantity;
        let updatedTradeAveragePrice =
          updatedTradeAmount / updatedTradeQuantity;

        const updateTrade = await Trade.update(
          {
            buyPrice: buyPrice,
            averagePrice: updatedTradeAveragePrice,
            quantity: updatedTradeQuantity,
            amount: updatedTradeAmount,
          },
          {
            where: {
              id: +isAssetOwned.id,
              status: "open",
            },
          }
        );

        res.status(200).json({
          data: {
            CommodityId: CommodityId,
            newBuyPrice: buyPrice,
            newAveragePrice: updatedTradeAveragePrice,
            newQuantity: updatedTradeQuantity,
            newAmount: updatedTradeAmount,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });
      }
    } catch (err) {
      next(err);
    }
  }

  static async sellCrypto(req, res, next) {
    try {
      const { privileges } = req;
      const { CommodityId, quantity } = req.body;

      const findCommodity = await Commodity.findByPk(+CommodityId);

      if (!findCommodity) {
        throw new Error("NOT_FOUND");
      }

      if (quantity <= 0 || isNaN(quantity)) {
        throw new Error("QTY_ERROR");
      }

      const binanceMarket = await axios.get(
        `https://api.binance.com/api/v3/ticker/price?symbol=${findCommodity.symbol}`
      );

      const sellPrice = +binanceMarket.data.price;
      let sellQuantity = +quantity;
      let sellAmount = sellPrice * sellQuantity;

      const creditBalance = await User.increment(
        {
          balance: sellAmount,
        },
        {
          where: {
            id: +privileges.givenId,
          },
        }
      );

      // find an asset, where as per commodity id with status open to sell
      const isAssetOwned = await Trade.findOne({
        where: {
          CommodityId: +CommodityId,
          status: "open",
          UserId: +privileges.givenId,
        },
        attributes: {
          include: ["id"],
        },
      });

      if (!isAssetOwned) {
        throw new Error('NOT_FOUND')
      }

      let previousAverage = +isAssetOwned.averagePrice;
      let previousAmount = +isAssetOwned.amount;
      let previousQuantity = +isAssetOwned.quantity;
      let previousBuy = +isAssetOwned.buyPrice;

      let remainingTradeAmount = previousAmount - sellAmount;
      let remainingTradeQuantity = previousQuantity - sellQuantity;

      if (remainingTradeQuantity < 0) {
        throw new Error("QTY_ERROR");
      }

      let remainingAveragePrice = remainingTradeAmount / remainingTradeQuantity;

      let realised = previousAverage - sellPrice;
      let realisedAmount = realised * sellQuantity;

      // close the old trade, update with sell information
      const closedTrade = await Trade.update(
        {
          sellPrice: sellPrice,
          quantity: sellQuantity,
          amount: sellAmount,
          realised: realised, // spot price difference
          realisedAmount: realisedAmount, // total gain or loss
          status: "closed",
        },
        {
          where: {
            id: +isAssetOwned.id, // trade ID, as per previous commodity owned
          },
        }
      );

      res.status(201).json({
        closed: {
          CommodityId: CommodityId,
          sellPrice: sellPrice,
          sellQuantity: sellQuantity,
          sellAmount: sellAmount,
          createdAt: new Date(),
          updatedAt: new Date(),
        }})

      if (remainingTradeQuantity > 0) {
        // create a new trade, with information of the remaining amount
        const remainingTrade = await Trade.create({
          UserId: +privileges.givenId,
          CommodityId: +CommodityId,
          buyPrice: remainingAveragePrice, // inherit new average price as buy price
          quantity: remainingTradeQuantity,
          amount: remainingTradeAmount,
          averagePrice: remainingAveragePrice,
          status: "open",
        });

        res.status(201).json({
          closed: {
            CommodityId: CommodityId,
            sellPrice: sellPrice,
            sellQuantity: sellQuantity,
            sellAmount: sellAmount,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          remaining: remainingTrade,
        });
      }
    } catch (err) {
      next(err);
    }
  }

  static async updateInterest(req, res, next) {
    try {
      const { cron_scheduler } = req.headers;

      const currentTime = new Date();

      const openTrades = await Trade.findAll({
        attributes: {
          include: ["id"],
        },
        where: {
          status: "open",
        },
      });

      const yearInMilisecond = 365 * 24 * 3600 * 1000;
      const commodities = await Commodity.findAll();

      for (const commodity of commodities) {
        for (const trade of openTrades) {
          if (trade.CommodityId === commodity.id) {
            const timeDifference = currentTime - trade.updatedAt;

            const interest =
              (commodity.interestRate * trade.amount * timeDifference) /
              yearInMilisecond;

            const creditInterest = await User.increment(
              {
                balance: interest,
              },
              {
                where: {
                  id: +trade.UserId,
                },
              }
            );

            const logStaking = await Staking.create({
            UserId: +trade.UserId,
            name: `${commodity.name} staking reward`,
            status: 'paid',
            amount: +interest            
          })
          }
        }
      }

      res.status(200).json({
        timestamp: new Date(),
        message: `Interest credited to all users`,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getStaking(req, res, data) {
    try {
      const { privileges } = req;

      const stakingData = await Staking.findAll({
        where: {
          UserId: +privileges.givenId
        },
        limit: 20,
        order: [['id','DESC']]
      })

      res.status(200).json(stakingData);
      
    } catch(err) {
      next(err)
    }
  }

  static async getSummaryData(req, res, next) {
    try {
      const { privileges } = req;

      const realisedTrade = await Trade.findAll({
        attributes: [[sequelize.where(sequelize.fn('SUM', sequelize.col('realisedAmount')), 'totalRealised')]],
        where: {
          UserId: +privileges.givenId
        }
      });

      const rewards = await Staking.findAll({
        attributes: [[sequelize.where(sequelize.fn('SUM', sequelize.col('amount')), 'totalStaking')]],
        where: {
          UserId: +privileges.givenId
        }
      });

      const totalTrades = await Trade.findAll({
        attributes: [[sequelize.where(sequelize.fn('SUM', sequelize.col('amount')), 'totalTrades')]],
        where: {
          UserId: +privileges.givenId
        }
      });

      res.status(200).json({
        realisedTotal: realisedTrade.data,
        rewardTotal: rewards.data,
        tradesTotal: totalTrades.data
      });

    } catch(err) {
      next(err)
    }
   }
}

module.exports = TradingController;
