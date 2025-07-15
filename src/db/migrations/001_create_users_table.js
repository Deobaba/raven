exports.up = function(knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('full_name', 100).notNullable();
    table.string('email', 255).notNullable().unique();
    table.string('password_hash', 255).notNullable();
    table.string('phone_number', 20).notNullable();
    table.string('virtual_account_number', 20).nullable();
    table.string('virtual_account_bank', 100).nullable();
    table.timestamps(true, true);
    
    table.index(['email']);
    table.index(['virtual_account_number']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('users');
}; 