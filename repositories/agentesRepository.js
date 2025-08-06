const db = require('../db/db');

module.exports = {
  async findAll({ cargo, sort, dataDeIncorporacao }) {
    try {
      let query = db('agentes');
      if (cargo) query = query.where('cargo', cargo);
      if (dataDeIncorporacao) query = query.where('dataDeIncorporacao', '>=', dataDeIncorporacao);

      const validSorts = ['nome', 'dataDeIncorporacao', 'cargo'];
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
      if (!agente) {
        const err = new Error('Agente não encontrado.');
        err.statusCode = 404;
        throw err;
      }
      return agente;
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
      const [updated] = await db('agentes').where({ id }).update(data).returning('*');
      if (!updated) {
        const err = new Error('Agente não encontrado para atualização.');
        err.statusCode = 404;
        throw err;
      }
      return updated;
    } catch (error) {
      throw error;
    }
  },

  async remove(id) {
    try {
      const deleted = await db('agentes').where({ id }).del();
      if (!deleted) {
        const err = new Error('Agente não encontrado para remoção.');
        err.statusCode = 404;
        throw err;
      }
      return true;
    } catch (error) {
      throw error;
    }
  }
};
