const repository = require('../repositories/casosRepository');
const { casoSchema } = require('../utils/casoValidation');
const { AppError } = require('../utils/errorHandler');

const getAllCasos = async (req, res, next) => {
    try {
        const casos = await repository.findAll();
        res.status(200).json(casos);
    } catch (error) {
        next(error);
    }
};

const getCasoById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const caso = await repository.findById(id);
        if (!caso) throw new AppError(404, 'Caso não encontrado');
        res.status(200).json(caso);
    } catch (error) {
        next(error);
    }
};

const createCaso = async (req, res, next) => {
    try {
        const data = casoSchema.parse(req.body);
        const caso = await repository.create(data);
        res.status(201).json(caso);
    } catch (error) {
        next(error);
    }
};

const updateCaso = async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = casoSchema.partial().parse(req.body);
        const caso = await repository.update(id, data);
        if (!caso) throw new AppError(404, 'Caso não encontrado para atualizar');
        res.status(200).json(caso);
    } catch (error) {
        next(error);
    }
};

const deleteCaso = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deleted = await repository.remove(id);
        if (!deleted) throw new AppError(404, 'Caso não encontrado para deletar');
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllCasos,
    getCasoById,
    createCaso,
    updateCaso,
    deleteCaso,
};