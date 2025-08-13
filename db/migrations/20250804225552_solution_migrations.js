/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
   return await knex.schema
    .createTable('agentes', table => {
      table.increments('id').primary();
      table.string('nome').notNullable();
      table.date('data_de_incorporacao').notNullable(); 
      table.string('cargo').notNullable();
    })
    .createTable('casos', table => {
      table.increments('id').primary();
      table.string('titulo').notNullable();
      table.text('descricao').notNullable();
      table.string('status').notNullable();
      table.integer('agente_id').unsigned().references('id').inTable('agentes').onDelete('CASCADE');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
     return knex.schema
    .dropTableIfExists('casos')
    .dropTableIfExists('agentes');
  
};