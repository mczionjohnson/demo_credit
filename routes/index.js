const express = require("express");
const userRouter = express.Router();

const knex = require("../data/knex.js");
const axios = require("axios");

userRouter.get("/", (req, res) => {
  // res.json({ message: "Fintech!" });
  res.send({ message: "Welcome to the future of Fintech!" });
});

userRouter.get("/admin/wallets", (req, res) => {
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

userRouter.get("/admin/users", (req, res) => {
  knex
    .select()
    .from("users")
    .then((users) => {
      res.send(users);
    });
});

//user register
userRouter.post("/register", async (req, res) => {
  const { name, email } = req.body;

  try {
    const response = await axios
      .get(`https://adjutor.lendsqr.com/v2/verification/karma/${email}`, {
        headers: { Authorization: process.env.API_KEY },
      })
      .then(() => {
        res.send("not allowed");
      });
  } catch (error) {
    // res.status(404).send("not found");
    console.log(error.message);
    // res.send("user not found");
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
  }

  // knex.raw("insert into users(name, email) values(?, ?)", [name, email])
});

//user login
userRouter.post("/login", (req, res) => {
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
userRouter.get("/:id", (req, res) => {
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
userRouter.get("/:id/wallets", (req, res) => {
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

// user deposits
userRouter.post("/:id/wallets/fund", (req, res) => {
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

// user withdraw
userRouter.post("/:id/wallets/withdraw", (req, res) => {
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

// user makes a transfer
userRouter.post("/:id/wallets/transfer", (req, res) => {
  const id = req.params.id;
  const { amount, beneficiary } = req.body;

  if (id == beneficiary) {
    res.send("the sender and the receiver cannot be the same");
  } else {
    // find wallet
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

          //update wallet
          knex("wallets")
            .where("user_id", id)
            .update({
              balance: new_bal,
            })
            .then(() => {
              //find beneficiary's wallet
              knex
                .select()
                .from("wallets")
                .where("user_id", beneficiary)
                .then((wallet) => {
                  //update beneficiary's wallet
                  const ben_bal = parseFloat(wallet[0].balance);

                  const new_ben_bal = ben_bal + amount;
                  knex("wallets")
                    .where("user_id", beneficiary)
                    .update({
                      balance: new_ben_bal,
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
            });
        }
      });
  }
  // knex.raw("insert into wallets(balance, user_id) values(?, ?) []");
});

// testing the Adjutor API
// app.get("/karma", async (req, res) => {
//   const identity = "mczionjohnson@gmail.com";
//   // const identity = "0zspgifzbo.ga";

//   try {
//     const response = await axios.get(
//       `https://adjutor.lendsqr.com/v2/verification/karma/${identity}`,
//       { headers: { Authorization: process.env.API_KEY } }
//     );
//   } catch (error) {
//     // res.status(404).send("not found");
//     console.log(error.message);
//     res.send("user not found");
//   }
// });

module.exports = userRouter;
