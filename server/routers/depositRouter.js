const express = require("express");
const router = express.Router();
const DepositController = require("../controllers/depositController");
const { authenticate } = require("../middlewares/authHandler");

router.post("/prepay", authenticate, DepositController.postDeposit);
router.post("/postpay", DepositController.success);
router.get('/', authenticate, DepositController.depositList)

module.exports = router;
