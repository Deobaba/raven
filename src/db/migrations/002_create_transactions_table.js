exports.up = function(knex) {
  return knex.schema.createTable('transactions', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable();
    table.enum('type', ['deposit', 'transfer']).notNullable();
    table.decimal('amount', 15, 2).notNullable();
    table.string('reference', 100).notNullable().unique();
    table.enum('status', ['pending', 'success', 'failed']).notNullable();
    table.text('description').nullable();
    table.json('metadata').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.index(['user_id']);
    table.index(['reference']);
    table.index(['type']);
    table.index(['status']);
    table.index(['created_at']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('transactions');
}; 