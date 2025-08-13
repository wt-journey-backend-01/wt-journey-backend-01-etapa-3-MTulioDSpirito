exports.up = async function (knex) {
  await knex.schema.createTable('casos', (table) => {
    table.increments('id').primary();
    table.string('titulo').notNullable();
    table.text('descricao').notNullable();
    // Ajustado para usar os valores 'aberto' e 'solucionado' para consistência
    table.enu('status', ['aberto', 'solucionado']).notNullable();
    table
      .integer('agente_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('agentes')
      .onDelete('CASCADE');
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('casos');
};