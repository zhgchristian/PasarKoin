const jwt = require("jsonwebtoken");

function signToken(payload) {
  const token = jwt.sign(payload, "cincai");
  return token;
}

function verifyToken(token) {
  const payloadData = jwt.verify(token, "cincai");
  return payloadData;
}

module.exports = { signToken, verifyToken };
