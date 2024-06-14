const express = require("express");

const db = require("./data/knex.js");
const dotenv = require("dotenv");
const app = express();

dotenv.config();
app.use(express.json());

app.get("/", (req, res) => {
  res.json("Hello");
});

app.listen(process.env.PORT || 8000, () => {
  console.log("server is running");
});
