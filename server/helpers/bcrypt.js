const bcrypt = require("bcryptjs");

const encryptPassword = (password) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};

function decryptPassword(plain, hash) {
  return bcrypt.compareSync(plain, hash);
}

module.exports = { encryptPassword, decryptPassword };
