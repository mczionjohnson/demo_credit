/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('wallets').del()
  await knex('wallets').insert([
    {id: 1, balance: 900.89, user_id: 1},
    {id: 2, balance: 1900.89, user_id: 2},
    {id: 3, balance: 2900.89, user_id: 3},
  ]);
};
