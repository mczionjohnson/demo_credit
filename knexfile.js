// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: "mysql",
    connection: {
      host: process.env.HOST,
      port: process.env.DB_PORT,
      user: process.env.USER,
      password: process.env.PASSWORD,
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
