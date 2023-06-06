const errorHandler = (err, req, res, next) => {
  console.log(err, 'INI ERROR')

  let code = 500;
  let msg = "Internal Server Error";

  if (err.name === "SequelizeValidationError") {
    code = 400;
    msg = err.message;
  }

  if (err.name === "SequelizeUniqueConstraintError") {
    code = 400;
    msg = err.errors[0].message;
  }

  if (err.name === "SequelizeForeignKeyConstraintError") {
    err.message.includes("categoryId")
      ? (msg = "No category with such ID exists")
      : (msg = "No author with such ID exists");
    code = 400;
  }

  if (err.name === "SequelizeDatabaseError") {
    code = 400;
    msg = "Wrong data type";
  }

  if (err.message === "USERNAME_OR_PASSWORD_IS_EMPTY") {
    code = 400;
    msg = "Username and Password cannot be empty";
  }

  if (err.message === "INVALID_EMAIL_OR_PASSWORD") {
    code = 401;
    msg = "Unauthorized: Invalid Email or Password";
  }

  if (err.message.toLowerCase().includes("token")) {
    code = 401;
    msg = "Authentication failed";
  }

  if (err.message === "NO_AMOUNT") {
    code = 400;
    msg = "Amount cannot be empty";
  }

  if (err.message === "QTY_ERROR") {
    code = 400;
    msg = "Quantity is invalid";
  }

  if (err.message === "CANNOT_ACCESS") {
    code = 403;
    msg = "Forbidden";
  }

  if (err.message === "NOT_FOUND") {
    code = 404;
    msg = "Error Not Found";
  }

  if (err.message == "DEPOSIT_PAID") {
    code = 400;
    msg = "This deposit has been completed";
  }

  if (err.message === "INSUFFICIENT_FUND") {
    code = 400;
    msg = "The specified user doesn't have enough balance remaining";
  }

  res.status(code).json({
    statusCode: code,
    message: msg,
  });
};

module.exports = { errorHandler };
