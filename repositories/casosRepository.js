const db = require('../db/db');
const { AppError } = require('../utils/errorHandler');

async function findAll() {
    try {
        // Busca todos os casos ordenados por ID
        return await db('casos').select('*').orderBy('id', 'asc');
    } catch (error) {
        throw new AppError(500, 'Erro ao buscar casos', [error.message]);
    }
}

async function findById(id) {
    try {
        // Busca um caso específico pelo ID
        return await db('casos').where({ id }).first();
    } catch (error) {
        throw new AppError(500, 'Erro ao buscar caso', [error.message]);
    }
}

async function create(data) {
    try {
        // Mapeia os dados do objeto JavaScript (camelCase) para o formato do banco (snake_case)
        const dataToInsert = {
            titulo: data.titulo,
            descricao: data.descricao,
            status: data.status,
            agente_id: data.agenteId, // Mapeamento de agenteId para agente_id
        };
        const [caso] = await db('casos').insert(dataToInsert).returning('*');
        return caso;
    } catch (error) {
        throw new AppError(500, 'Erro ao criar caso', [error.message]);
    }
}

async function update(id, data) {
    try {
        // Mapeia os dados do objeto JavaScript (camelCase) para o formato do banco (snake_case) para atualização
        const dataToUpdate = {};
        if (data.titulo !== undefined) dataToUpdate.titulo = data.titulo;
        if (data.descricao !== undefined) dataToUpdate.descricao = data.descricao;
        if (data.status !== undefined) dataToUpdate.status = data.status;
        if (data.agenteId !== undefined) dataToUpdate.agente_id = data.agenteId; // Mapeamento para agente_id

        const [caso] = await db('casos').update(dataToUpdate).where({ id }).returning('*');
        return caso || null; // Retorna o caso atualizado ou null se não encontrado
    } catch (error) {
        throw new AppError(500, 'Erro ao atualizar caso', [error.message]);
    }
}

async function remove(id) {
    try {
        // Remove um caso pelo ID
        const deleted = await db('casos').where({ id }).del();
        return deleted > 0; // Retorna true se algo foi deletado, false caso contrário
    } catch (error) {
        throw new AppError(500, 'Erro ao deletar caso', [error.message]);
    }
}

module.exports = { findAll, findById, create, update, remove };