exports.seed = async function (knex) {
  await knex('agentes').del();
  await knex('agentes').insert([
    { nome: 'João Silva', cargo: 'Investigador', data_de_incorporacao: '2020-03-12' },
    { nome: 'Maria Costa', cargo: 'Delegada', data_de_incorporacao: '2019-08-25' }
  ]);
};