const dotenv = require("dotenv");


dotenv.config()
// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: "mysql2",
    connection: {
      host: process.env.HOST,
      port: process.env.DB_PORT,
      user: 'nodeuser',
      password: 'nodeuser@1234',
      database: process.env.DEV_DATABASE,
    },

    migrations: {
      directory: (__dirname = "data/migrations"),
    },
    seeds: {
      directory: (__dirname = "data/seeds"),
    },
  },
};
