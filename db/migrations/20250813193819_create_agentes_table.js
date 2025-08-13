exports.up = async function (knex) {
  await knex.schema.createTable('agentes', (table) => {
    table.increments('id').primary();
    table.string('nome').notNullable();
    table.string('cargo').notNullable();
    table.date('data_de_incorporacao').notNullable();
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('agentes');
};