const express = require("express");

const db = require("./data/knex.js");
const dotenv = require("dotenv");
const app = express();
var mysql = require('mysql2');


dotenv.config();
app.use(express.json());
    
var con = mysql.createConnection({
 host: "localhost",
 user: "nodeuser",
 password: "nodeuser@1234"
});
    
con.connect(function(err) {
 if (err) throw err;
 console.log("Connected!");
});

app.get("/", (req, res) => {
  res.json({message: "Hello"});
});

app.listen(process.env.PORT || 8000, () => {
  console.log("server is running");
});
