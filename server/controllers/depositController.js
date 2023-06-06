const axios = require("axios");
const { Deposit, User } = require("../models/index");

class DepositController {
  static async depositList(req, res, next) {
    try {
      const { privileges } = req;

      const deposits = await Deposit.findAll({
        where: {
          UserId: +privileges.givenId,
          status: 'paid'
        },
        limit: 10,
        order: [['id', 'DESC']]
      })

      res.status(200).json({
        deposits
      })

    } catch(err) {
      next(err)
    }
  }


  static async postDeposit(req, res, next) {
    try {
      const { privileges } = req;
      const { amount } = req.body;

      if (!amount) {
        throw new Error("NO_AMOUNT");
      }

      const newDeposit = await Deposit.create({
        UserId: +privileges.givenId,
        amount: +amount,
        status: "pending",
      });

      const now = Date.now();

      const headerRequest = {
        transaction_details: {
          order_id: `${now}D${newDeposit.id}`,
          gross_amount: +amount,
        },
      };

      const midtransResponse = await axios.post(
        "https://app.sandbox.midtrans.com/snap/v1/transactions",
        headerRequest,
        {
          headers: {
            Authorization: `${process.env.MIDTRANS_AUTH}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (midtransResponse.error_messages) {
        throw new Error(midtransResponse.error_messages, "INI ERROR MIDTRANS");
      }

      const updatePayUrl = await Deposit.update(
        {
          paymentUrl: midtransResponse.data.redirect_url,
          token: midtransResponse.data.token,
        },
        { where: { id: +newDeposit.id } }
      );

      res.status(201).json({
        token: midtransResponse.data.token,
        paymentUrl: midtransResponse.data.redirect_url,
      });
    } catch (err) {
      next(err);
    }
  }

  static success(req, res, next) {
    res.status(200).json({
      message: `Transaction has been cancelled`,
    });
  }

  static async paymentNotification(req, res, next) {
    try {
      const { order_id, transaction_status, transaction_id } = req.body;
      const depositId = order_id.substring(14);
      const findDeposit = await Deposit.findByPk(+depositId);

      if (!findDeposit) {
        throw new Error("NOT_FOUND");
      }

      if (findDeposit.status === "paid") {
        throw new Error("DEPOSIT_PAID");
      }

      // check signature to midtrans
      const transactionData = await axios.get(
        `https://api.sandbox.midtrans.com/v2/${order_id}/status`,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `${process.env.MIDTRANS_AUTH}`,
          },
        }
      );

      const transactionId = transactionData.data.transaction_id;

      if (transactionId !== transaction_id) {
        throw new Error("CANNOT_ACCESS");
      }

      if (
        transaction_status === "settlement" ||
        transaction_status === "capture"
      ) {
        const depositSettlement = await Deposit.update(
          {
            status: "paid",
          },
          {
            where: {
              id: +depositId,
            },
          },
          {
            include: {
              attributes: ["amount"],
            },
          }
        );

        const updateBalance = await User.increment(
          {
            balance: +findDeposit.amount,
          },
          {
            where: {
              id: +findDeposit.UserId,
            },
          }
        );

        res.status(200).json({
          message: `${findDeposit.amount} added to User ID ${findDeposit.UserId} balance`,
        });
      } else if (
        transaction_status === "deny" ||
        transaction_status === "cancel" ||
        transaction_status === "expire"
      ) {
        const depositSettlement = await Deposit.update(
          {
            status: "failed",
          },
          {
            where: {
              id: +depositId,
            },
          },
          {
            include: {
              attributes: ["amount"],
            },
          }
        );

        res.status(200).json({
          message: `Transaction has been cancelled`,
        });
      }
    } catch (err) {
      next(err);
    }
  }
}

module.exports = DepositController;
