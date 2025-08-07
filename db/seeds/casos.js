exports.seed = async function(knex) {
  await knex('casos').del();
  return knex('casos').insert([
    {
      titulo: 'Caso do Diamante',
      descricao: 'Roubo de diamante na mansão Abernathy',
      status: 'aberto',
      agente_id: 1
    },
    {
      titulo: 'Desaparecimento na Floresta',
      descricao: 'Desaparecimento de adolescente na floresta Blackwood',
      status: 'solucionado',
      agente_id: 2
    }
  ]);
};