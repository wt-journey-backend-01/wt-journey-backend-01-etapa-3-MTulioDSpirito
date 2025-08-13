exports.seed = async function (knex) {
  await knex('casos').del();
  await knex('casos').insert([
    { titulo: 'Roubo a banco', descricao: 'Investigação em andamento.', status: 'aberto', agente_id: 1 },
    { titulo: 'Homicídio em zona rural', descricao: 'Caso resolvido com prisão do suspeito.', status: 'solucionado', agente_id: 2 }
  ]);
};