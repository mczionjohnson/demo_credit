const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");

const app = express();

dotenv.config();
// app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/", require("./routes/index.js"));

app.all("*", (req, res) => {
  res.status(404).send("not found");
});

app.listen(process.env.PORT || 8001, () => {
  console.log("server is running");
});
