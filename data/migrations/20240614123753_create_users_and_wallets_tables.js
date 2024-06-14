/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
    .createTable("users", (table) => {
      table.increments('id');
      table.string("name").notNull();
      table.string("email").notNull();
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
    })
    .createTable("wallets", (table) => {
      table.increments('id');
      table.decimal("balance").notNull(); //defaults to 8 and 2 decimal place
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
      table.integer("user_id",11).unsigned().references("id").on("users"); //foreign key
      
      // table.integer("user_id",11).unsigned().references("user_id").inTable("users"); //foreign key

      // table.integer('User',11).unsigned().references('UserId').inTable('users');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable("wallets").dropTable("users");
};
