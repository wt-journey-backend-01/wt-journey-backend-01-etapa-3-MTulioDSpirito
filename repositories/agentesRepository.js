const db = require('../db/db');

module.exports = {
  async findAll({ cargo, sort, dataDeIncorporacao }) {
    try {
      let query = db('agentes');
      if (cargo) query = query.where('cargo', cargo);
      if (dataDeIncorporacao) query = query.where('data_de_incorporacao', '>=', dataDeIncorporacao);

      const validSorts = ['nome', 'data_de_incorporacao', 'cargo'];
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
      return await db('agentes').where({ id }).first();
    } catch (error) {
      throw error;
    }
  },

  async create(data) {
    try {
      const [created] = await db('agentes').insert(data).returning('*');
      return created;
    } catch (error) {
      throw new Error('Erro ao criar agente.');
    }
  },

  async update(id, data) {
    try {
      const exists = await db('agentes').where({ id }).first();
      if (!exists) return null;

      // CORREÇÃO: Usar o parâmetro 'data' diretamente
      const [updated] = await db('agentes')
        .where({ id })
        .update(data)  // Correção aplicada aqui
        .returning('*');
        
      return updated;
    } catch (error) {
      throw error;
    }
  },

  async remove(id) {
    try {
      return await db('agentes').where({ id }).del();
    } catch (error) {
      throw error;
    }
  }
};