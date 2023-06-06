const express = require("express");
const router = express.Router();
const TradingController = require("../controllers/tradingController");

router.get("/", TradingController.getOpenTrades);
router.get("/close", TradingController.getClosedTrades);
router.get("/user", TradingController.getUserData);
router.get("/commodities", TradingController.getCommodities);
router.get("/commodities/:id", TradingController.getCommodityById);

router.post("/buy", TradingController.buyCrypto);
router.post("/sell", TradingController.sellCrypto);
router.get('/stakings', TradingController.getStaking)
router.get('/summary', TradingController.getSummaryData)


module.exports = router;
