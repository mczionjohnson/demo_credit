const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");

const app = express();

// app.use(express.json());

app.use(bodyParser.json()); //json
app.use(bodyParser.urlencoded({ extended: false })); //
dotenv.config({ path: "./.env" });

const userRouter = require("./routes/index.js");

app.use("/", userRouter);

app.all("*", (req, res) => {
  res.status(404).send("not found");
});

module.exports = app;
