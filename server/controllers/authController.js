const { decryptPassword } = require("../helpers/bcrypt.js");
const { signToken, verifyToken } = require("../helpers/jwt.js");
const { User } = require("../models/index.js");
const { OAuth2Client } = require("google-auth-library");

class AuthController {
  static async register(req, res, next) {
    try {
      const { password, email } = req.body;
      const created = await User.create({
        password: password,
        status: "not_verified",
        email: email,
        balance: 0,
      });

      res.status(201).json({
        statusCode: 201,
        message: "Register Success",
        data: {
          id: created.id,
          email: created.email,
          status: created.status,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new Error("USERNAME_OR_PASSWORD_IS_EMPTY");
      }

      const foundUser = await User.findOne({
        where: {
          email,
        },
      });

      if (!foundUser) {
        throw new Error("INVALID_EMAIL_OR_PASSWORD");
      }
      if (!decryptPassword(password, foundUser.password)) {
        throw new Error("INVALID_EMAIL_OR_PASSWORD");
      }

      const payload = {
        id: foundUser.id,
        email: foundUser.email,
        status: foundUser.status,
      };

      const token = signToken(payload);

      res.status(200).json({
        statusCode: 200,
        message: "Login success",
        access_token: token,
        userdata: {
          id: foundUser.id,
          email: foundUser.email,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  static async gLogin(req, res, next) {
    try {
      const { token_google } = req.body;

      if (!token_google) {
        throw new Error("INVALID_EMAIL_OR_PASSWORD");
      }

      const client = new OAuth2Client(process.env.CLIENT_ID);
      const ticket = await client.verifyIdToken({
        idToken: token_google,
        audience: process.env.CLIENT_ID,
      });

      let payload = ticket.getPayload();

      const [googleUser] = await User.findOrCreate({
        where: {
          email: payload.email,
        },
        defaults: {
          password: payload.jti,
          status: "verified",
          email: payload.email,
          balance: 0,
        },
      });

      const newPayload = {
        id: googleUser.id,
        email: googleUser.email,
        status: googleUser.status,
      };

      const internalToken = signToken(newPayload);

      res.status(200).json({
        statusCode: 200,
        message: "Login success",
        access_token: internalToken,
        userdata: {
          id: googleUser.id,
          role: googleUser.role,
          email: googleUser.email,
        },
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = AuthController;
