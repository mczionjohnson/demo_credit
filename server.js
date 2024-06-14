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

  knex
    .raw("insert into users(name, email) values(?, ?)", [name, email])
    .then(() => {
      //query the db for the new user
      knex
        .select()
        .from("users")
        .where("email", email)
        .then((result) => {
          const id = result[0].id;
          //  create wallet
          knex
            .raw("insert into wallets(balance, user_id) values(?, ?)", [
              0.0,
              id,
            ])
            .then(() => {
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
    .where("id", `${id}`)
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
    .where("id", `${id}`)
    .then((wallet) => {
      res.send(wallet);
    });
});

//user updates wallet
app.post("/:id/wallets/fund", (req, res) => {
  const id = req.params.id;
  const { funds } = req.body;

  knex
    .select()
    .from("wallets")
    .where("id", `${id}`)
    .then((wallet) => {
      const check = parseFloat(wallet[0].balance);

      const new_funds = check + funds;
      console.log(new_funds);

      knex
        .raw("insert into wallets(balance, user_id) values($1, $2)", [
          new_funds,
          id,
        ])
        .then(() => {
          // knex
          //   .select()
          //   .from("wallets")
          //   .where("id", `${id}`)
          //   .then((wallet) => {
          //     res.send(wallet);
          //   });
        });
    });

  // knex.raw("insert into wallets(balance, user_id) values($1, $2) []");
});

app.post("/:id/wallets/withdraw", (req, res) => {
  const id = req.params.id;
  const { funds } = req.body;

  knex
    .select()
    .from("wallets")
    .where("id", `${id}`)
    .then((wallet) => {
      const check = parseFloat(wallet[0].balance);

      const new_funds = check + funds;
      console.log(new_funds);

      knex
        .raw("insert into wallets(balance, user_id) values($1, $2)", [
          new_funds,
          id,
        ])
        .then(() => {
          // knex
          //   .select()
          //   .from("wallets")
          //   .where("id", `${id}`)
          //   .then((wallet) => {
          //     res.send(wallet);
          //   });
        });
    });

  // knex.raw("insert into wallets(balance, user_id) values($1, $2) []");
});

app.listen(process.env.PORT || 8001, () => {
  console.log("server is running");
});
