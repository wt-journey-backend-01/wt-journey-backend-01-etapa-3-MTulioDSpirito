const repository = require('../repositories/agentesRepository');
const { agenteSchema } = require('../utils/agenteValidation');
const { AppError } = require('../utils/errorHandler');

const getAllAgentes = async (req, res, next) => {
    try {
        const agentes = await repository.findAll();
        res.status(200).json(agentes);
    } catch (error) {
        next(error);
    }
};

const getAgenteById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const agente = await repository.findById(id);
        if (!agente) throw new AppError(404, 'Agente não encontrado');
        res.status(200).json(agente);
    } catch (error) {
        next(error);
    }
};

const createAgente = async (req, res, next) => {
    try {
        const data = agenteSchema.parse(req.body);
        const agente = await repository.create(data);
        res.status(201).json(agente);
    } catch (error) {
        next(error);
    }
};

const updateAgente = async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = agenteSchema.partial().parse(req.body);
        const agente = await repository.update(id, data);
        if (!agente) throw new AppError(404, 'Agente não encontrado para atualizar');
        res.status(200).json(agente);
    } catch (error) {
        next(error);
    }
};

const deleteAgente = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deleted = await repository.remove(id);
        if (!deleted) throw new AppError(404, 'Agente não encontrado para deletar');
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllAgentes,
    getAgenteById,
    createAgente,
    updateAgente,
    deleteAgente,
};