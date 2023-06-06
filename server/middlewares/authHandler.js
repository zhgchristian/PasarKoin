const { verifyToken } = require("../helpers/jwt");
const { User, Product } = require("../models/index");

const authenticate = async (req, res, next) => {
  try {
    const access_token = req.headers.access_token;

    if (!access_token) {
      throw new Error("INVALID_TOKEN");
    }
    const payload = verifyToken(access_token);

    const isValidUser = await User.findByPk(+payload.id);
    if (!isValidUser) {
      throw new Error("INVALID_TOKEN");
    }

    req.privileges = {
      givenId: isValidUser.id,
      givenEmail: isValidUser.email,
      givenStatus: isValidUser.status,
    };

    next();
  } catch (err) {
    next(err);
  }
};

// const authorization = async (req, res, next) => {
//   try {
//     const userId = +req.privileges.givenId;
//     const status = req.privileges.givenStatus;
//     const email = +req.privileges.email;

//     if (!userId || !role || !productId) {
//       throw new Error("CANNOT_ACCESS");
//     }

//     const productDetail = await Product.findByPk(productId);
//     if (!productDetail) {
//       throw new Error("NOT_FOUND");
//     }

//     if (productDetail.authorId !== userId && role !== "admin") {
//       throw new Error("CANNOT_ACCESS");
//     }

//     next();
//   } catch (err) {
//     next(err);
//   }
// };

// const superAdmin = async (req, res, next) => {
//   try {
//     const userId = +req.privileges.givenId;
//     const role = req.privileges.givenRole;
//     const productId = +req.params.id;

//     if (!userId || !role || !productId) {
//       throw new Error("CANNOT_ACCESS");
//     }

//     const productDetail = await Product.findByPk(productId);
//     if (!productDetail) {
//       throw new Error("NOT_FOUND");
//     }

//     if (role !== "cron") {
//       throw new Error("CANNOT_ACCESS");
//     }

//     next();
//   } catch (err) {
//     next(err);
//   }
// };

// cron.schedule();

module.exports = { authenticate };
