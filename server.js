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

app.get("/admin/wallets", (req, res) => {
  //knex allows callbacks
  //knew.raw gives more data
  // knex.raw("select * from wallets").then((wallets) => {
  //   res.send(wallets);
  // });

  knex
    .select()
    .from("wallets")
    .then((wallets) => {
      res.send(wallets);
    });
});
app.get("/admin/users", (req, res) => {
  knex
    .select()
    .from("users")
    .then((users) => {
      res.send(users);
    });
});

//user register
app.post("/register", (req, res) => {
  const { name, email } = req.body;

  // knex.raw("insert into users(name, email) values(?, ?)", [name, email])

  knex("users")
    .insert({
      name: name,
      email: email,
    })
    .then(() => {
      //query the db for the new user
      knex
        .select()
        .from("users")
        .where("email", email)
        .then((result) => {
          const id = result[0].id;
          //  create wallet
          knex("wallets")
            .insert({
              balance: 0.0,
              user_id: id,
            })
            .then(() => {
              //return new wallet
              knex
                .select()
                .from("wallets")
                .where("user_id", id)
                .then((user) => {
                  res.send(user);
                });
            });
        });
    });
});

//user register
app.post("/login", (req, res) => {
  const { email, token } = req.body;

  if (token == "mypass") {
    knex
      .select()
      .from("users")
      .where("email", email)
      .then((user) => {
        res.send(user);
      });
  } else {
    res.send("please provide token");
  }
});

// user profile
app.get("/:id", (req, res) => {
  const id = req.params.id;

  //knex allows callbacks
  //knew.raw gives more data
  // knex.raw(`select * from wallets where id = ${id}`).then((wallet) => {
  //   res.send(wallet);
  // });

  knex
    .select()
    .from("users")
    .where("id", id)
    .then((user) => {
      res.send(user);
    });
});

// user opens wallet
app.get("/:id/wallets", (req, res) => {
  const id = req.params.id;

  //knex allows callbacks
  //knew.raw gives more data
  // knex.raw(`select * from wallets where id = ${id}`).then((wallet) => {
  //   res.send(wallet);
  // });

  knex
    .select()
    .from("wallets")
    .where("user_id", id)
    .then((wallet) => {
      res.send(wallet);
    });
});

app.post("/:id/wallets/fund", (req, res) => {
  const id = req.params.id;
  const { amount } = req.body;

  knex
    .select()
    .from("wallets")
    .where("user_id", id)
    .then((wallet) => {
      const bal = parseFloat(wallet[0].balance);

      const new_bal = bal + amount;
      // console.log(new_bal);

      //update wallet
      knex("wallets")
        .where("user_id", id)
        .update({
          balance: new_bal,
        })
        .then(() => {
          // return updated wallet
          knex
            .select()
            .from("wallets")
            .where("user_id", id)
            .then((wallet) => {
              res.send(wallet);
            });
        });
    });

  // knex.raw("insert into wallets(balance, user_id) values(?, ?) []");
});

app.post("/:id/wallets/withdraw", (req, res) => {
  const id = req.params.id;
  const { amount } = req.body;

  knex
    .select()
    .from("wallets")
    .where("user_id", id)
    .then((wallet) => {
      const bal = parseFloat(wallet[0].balance);

      if (amount > bal) {
        res.send("insufficient funds");
      } else {
        const new_bal = bal - amount;
        console.log(new_bal);

        //update wallet
        knex("wallets")
          .where("user_id", id)
          .update({
            balance: new_bal,
          })
          .then(() => {
            // return updated wallet
            knex
              .select()
              .from("wallets")
              .where("user_id", id)
              .then((wallet) => {
                res.send(wallet);
              });
          });
      }
    });

  // knex.raw("insert into wallets(balance, user_id) values(?, ?) []");
});

app.listen(process.env.PORT || 8001, () => {
  console.log("server is running");
});
