const knex = require("knex");
const dotenv = require("dotenv");

dotenv.config({ path: "../.env" });

const knexfile = require("../knexfile.js");

const env = process.env.NODE_ENV || "development";

const options = knexfile[env];

module.exports = knex(options);
