const db = require('../db/db');

module.exports = {
  async findAll({ status, agente_id, q }) {
    try {
      let query = db('casos');

      if (status) query = query.where('status', status);
      if (agente_id) query = query.where('agente_id', agente_id); // Garantir filtro por agente

      if (q && q.trim()) {
        const search = q.toLowerCase();
        query = query.where(function () {
          this.whereRaw('LOWER(titulo) LIKE ?', [`%${search}%`])
            .orWhereRaw('LOWER(descricao) LIKE ?', [`%${search}%`]);
        });
      }

      return await query;
    } catch (err) {
      throw new Error('Erro ao buscar casos: ' + err.message);
    }
  },

  async findById(id) {
    try {
      const caso = await db('casos').where({ id }).first();
      return caso; // Removido o throw para deixar o controller lidar com o 404
    } catch (err) {
      throw err;
    }
  },

  async create(data) {
    try {
      const [created] = await db('casos').insert(data).returning('*');
      return created;
    } catch (err) {
      throw new Error('Erro ao criar caso: ' + err.message);
    }
  },

  async update(id, data) {
    try {
      const [updated] = await db('casos').where({ id }).update(data).returning('*');
      return updated; // Removido o throw para deixar o controller lidar com o 404
    } catch (err) {
      throw err;
    }
  },

  async remove(id) {
    try {
      const deleted = await db('casos').where({ id }).del();
      return deleted; // Retorna 1 se deletado, 0 se não encontrado
    } catch (err) {
      throw err;
    }
  },

  async findByAgenteId(agenteId) {
    try {
      return await db('casos').where({ agente_id: agenteId });
    } catch (err) {
      throw new Error('Erro ao buscar casos por agente: ' + err.message);
    }
  }
};