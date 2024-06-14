const express = require("express");

const knex = require("./data/knex.js");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
// var mysql = require('mysql2');

const app = express();

dotenv.config();
// app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  // res.json({ message: "Fintech!" });
  res.send({ message: "Fintech!" });
});

app.get("/wallet", (req, res) => {
  //knex allows callbacks
  knex.raw("select * from wallets").then((wallets) => {
    res.send({ message: "Hello" });
  });
});

app.listen(process.env.PORT || 8000, () => {
  console.log("server is running");
});
