const dotenv = require("dotenv");

dotenv.config({ path: "../.env" });

// const env = process.env.NODE_ENV || "development";

const config = require("../knexfile.js");

// module.exports = knex(options);
module.exports = require("knex")(config);
