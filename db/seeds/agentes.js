exports.seed = async function(knex) {
  await knex('agentes').del();
  return knex('agentes').insert([
    {
      nome: 'Sherlock Holmes',
      data_de_incorporacao: '2020-01-15', // snake_case
      cargo: 'Detetive'
    },
    {
      nome: 'Jane Doe',
      data_de_incorporacao: '2022-05-20', // snake_case
      cargo: 'Agente de Campo'
    }
  ]);
};