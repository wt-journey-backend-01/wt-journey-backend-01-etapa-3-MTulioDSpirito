exports.seed = async function(knex) {
  await knex('agentes').del();
  await knex('agentes').insert([
    { id: 1, nome: 'João Silva', dataDeIncorporacao: '2020-03-12', cargo: 'Investigador' },
    { id: 2, nome: 'Maria Costa', dataDeIncorporacao: '2019-08-25', cargo: 'Delegada' }
  ]);
};
