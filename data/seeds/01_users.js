/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').del()
  await knex('users').insert([
    {id: 1, name: 'Danish', email: 'Danish@test.com'},
    {id: 2, name: 'English', email: 'English@test.com'},
    {id: 3, name: 'Spanish', email: 'Spanish@test.com'},
  ]);
};
