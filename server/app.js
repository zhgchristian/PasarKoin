if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const routes = require("./routers/index");
const { errorHandler } = require("./middlewares/errorHandler");
const cors = require("cors");

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(routes);
app.use(errorHandler);

module.exports = app;
