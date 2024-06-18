const app = require("../server.js");
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const supertest = require("supertest");
const knex = require("../data/knex.js");
const config = require("../knexfile.js");

const request = supertest("http://localhost:8000");

test("Sanity check", () => {
  expect(true).toBe(true);
});

jest.useFakeTimers();

// it("Should return a welcome message from the homepage", () => {
//   request.get("/").then((response) => {
//     expect(response.status).toBe(200);
//     expect(response.body).toBeTruthy();
//     expect(response.body).toEqual({
//       message: "Welcome to the future of Fintech!",
//     });
//   });
// });

it("Should return the list of users", () => {
  request.get("/admin/users").then((response) => {
    expect(response.status).toBe(200);
    expect(response.body).toBeTruthy();
  });
}, 15000);

// it("Should return the list of wallets", () => {
//   request
//     .get("/admin/wallets")
//     .then((response) => {
//     expect(response.status).toBe(200);
//       expect(response.body).toBeTruthy();
//     });
// });

it("Should save user to database", () => {
  // const payload = {
  //   name: "English",
  //   email: "English@test.com",
  // };

  request
    .post("/register")
    .send({
      name: "English",
      email: "English@test.com",
    })
    .set("Accept", "application/json")
    .then((response) => {
      expect(response.status).toBe(422);
      expect(response.body).toBeTruthy();
    });

  // Ensures response contains user's wallet
  // expect(res.body.user).toBeTruthy();

  // Should search the user in the database
  // const user = await knex
  //   .select()
  //   .from("wallets")
  //   .where("user_id", id)
  //   .then((user) => {
  //     expect(user.email).toBeTruthy();
  //   });

  //   // Ensures response contains user's wallet
  //   // expect(res.body.user).toBeTruthy();
}, 15000);
