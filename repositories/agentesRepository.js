const db = require('../db/db');
const { AppError } = require('../utils/errorHandler');

async function findAll() {
    try {
        // Selecionando todas as colunas e ordenando por id.
        // As colunas serão convertidas de snake_case (banco) para camelCase (JS)
        // se o postProcessResponse estiver ativado no db.js.
        return await db('agentes').select('*').orderBy('id', 'asc');
    } catch (error) {
        throw new AppError(500, 'Erro ao buscar agentes', [error.message]);
    }
}

async function findById(id) {
    try {
        // A conversão de nome de coluna de `id` não é necessária aqui, pois é um nome simples.
        // O `first()` retorna apenas um registro.
        return await db('agentes').where({ id }).first();
    } catch (error) {
        throw new AppError(500, 'Erro ao buscar agente', [error.message]);
    }
}

async function create(data) {
    try {
        // Mapeando dados do camelCase (JS) para snake_case (banco)
        // Isso é necessário porque removemos a conversão automática no db.js
        const dataToInsert = {
            nome: data.nome,
            data_de_incorporacao: data.dataDeIncorporacao, // Convertendo para snake_case
            cargo: data.cargo,
        };
        const [agente] = await db('agentes').insert(dataToInsert).returning('*');
        return agente;
    } catch (error) {
        throw new AppError(500, 'Erro ao criar agente', [error.message]);
    }
}

async function update(id, data) {
    try {
        // Mapeando dados do camelCase (JS) para snake_case (banco) para atualização
        const dataToUpdate = {};
        if (data.nome !== undefined) dataToUpdate.nome = data.nome;
        if (data.dataDeIncorporacao !== undefined) dataToUpdate.data_de_incorporacao = data.dataDeIncorporacao; // Convertendo
        if (data.cargo !== undefined) dataToUpdate.cargo = data.cargo;

        const [agente] = await db('agentes').update(dataToUpdate).where({ id }).returning('*');
        return agente || null; // Retorna o agente atualizado ou null se não encontrado
    } catch (error) {
        throw new AppError(500, 'Erro ao atualizar agente', [error.message]);
    }
}

async function remove(id) {
    try {
        const deleted = await db('agentes').where({ id }).del();
        return deleted > 0; // Retorna true se algo foi deletado, false caso contrário
    } catch (error) {
        throw new AppError(500, 'Erro ao deletar agente', [error.message]);
    }
}

module.exports = { findAll, findById, create, update, remove };