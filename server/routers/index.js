const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/authController");
const TradingController = require('../controllers/tradingController')
const depositRouter = require("../routers/depositRouter");
const tradeRouter = require("../routers/tradeRouter");
const { authenticate } = require("../middlewares/authHandler");

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/google", AuthController.gLogin);
router.use("/deposits", depositRouter);
router.post("/interest", TradingController.updateInterest);

router.use(authenticate);

router.use("/trades", tradeRouter);

module.exports = router;
