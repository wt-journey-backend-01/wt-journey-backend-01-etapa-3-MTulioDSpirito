const db = require('../db/db');

module.exports = {
  async findAll({ cargo, sort, dataDeIncorporacao }) {
    try {
      let query = db('agentes');
      if (cargo) query = query.where('cargo', cargo);
      if (dataDeIncorporacao) query = query.where('data_de_incorporacao', '>=', dataDeIncorporacao); // Corrigido para snake_case

      const validSorts = ['nome', 'data_de_incorporacao', 'cargo']; // Corrigido para snake_case
      if (sort) {
        const desc = sort.startsWith('-');
        const field = desc ? sort.slice(1) : sort;
        if (validSorts.includes(field)) query = query.orderBy(field, desc ? 'desc' : 'asc');
      }

      return await query;
    } catch (error) {
      throw new Error('Erro ao buscar agentes.');
    }
  },

  async findById(id) {
    try {
      const agente = await db('agentes').where({ id }).first();
      return agente; // Removido o throw para deixar o controller lidar com o 404
    } catch (error) {
      throw error;
    }
  },

  async create(data) {
    try {
      const [created] = await db('agentes').insert({
        nome: data.nome,
        data_de_incorporacao: data.dataDeIncorporacao, // Mapeamento manual
        cargo: data.cargo,
      }).returning('*');
      return created;
    } catch (error) {
      throw new Error('Erro ao criar agente.');
    }
  },

async update(id, data) {
  const exists = await db('agentes').where({ id }).first();
  if (!exists) return null; // Não encontrado

  const [updated] = await db('agentes')
    .where({ id })
    .update(dataToUpdate)
    .returning('*');
  return updated;
},

  async remove(id) {
    try {
      const deleted = await db('agentes').where({ id }).del();
      return deleted; // Retorna 1 se deletado, 0 se não encontrado
    } catch (error) {
      throw error;
    }
  }
};