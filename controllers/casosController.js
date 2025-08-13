const Joi = require('joi');
const casosRepository = require('../repositories/casosRepository');
const agentesRepository = require('../repositories/agentesRepository');
const { AppError } = require('../utils/errorHandler');

const casoSchema = Joi.object({
  titulo: Joi.string().required(),
  descricao: Joi.string().required(),
  status: Joi.string().valid('aberto', 'solucionado').required(),
  agente_id: Joi.number().required()
});

const patchSchema = Joi.object({
  titulo: Joi.string(),
  descricao: Joi.string(),
  status: Joi.string().valid('aberto', 'solucionado'),
  agente_id: Joi.number()
}).min(1);

module.exports = {
  async getAllCasos(req, res, next) {
    try {
      const { status, q } = req.query;
      if (q !== undefined && q.trim() === '') {
        throw new AppError(400, "O parâmetro 'q' não pode ser vazio.");
      }

      const casos = await casosRepository.findAll({ status, q });
      res.json(casos);
    } catch (err) {
      next(err);
    }
  },

  async getCasoById(req, res, next) {
    try {
      const { id } = req.params;
      const caso = await casosRepository.findById(id);
      if (!caso) throw new AppError(404, 'Caso não encontrado');
      res.json(caso);
    } catch (err) {
      next(err);
    }
  },

  async createCaso(req, res, next) {
    try {
      const { error, value } = casoSchema.validate(req.body);
      if (error) throw new AppError(400, error.details[0].message);

      const agente = await agentesRepository.findById(value.agente_id);
      if (!agente) throw new AppError(404, 'Agente atribuído não encontrado');

      const novoCaso = await casosRepository.create(value);
      res.status(201).json(novoCaso);
    } catch (err) {
      next(err);
    }
  },

  async putCaso(req, res, next) {
    try {
      const { id } = req.params;
      const { error, value } = casoSchema.validate(req.body);
      if (error) throw new AppError(400, error.details[0].message);

      const updated = await casosRepository.update(id, value);
      if (!updated) throw new AppError(404, 'Caso não encontrado');

      res.json(updated);
    } catch (err) {
      next(err);
    }
  },

  async patchCaso(req, res, next) {
    try {
      const { id } = req.params;
      const { error, value } = patchSchema.validate(req.body);
      if (error) throw new AppError(400, error.details[0].message);

      const updated = await casosRepository.update(id, value);
      if (!updated) throw new AppError(404, 'Caso não encontrado');

      res.json(updated);
    } catch (err) {
      next(err);
    }
  },

  async deleteCaso(req, res, next) {
    try {
      const deleted = await casosRepository.remove(req.params.id);
      if (!deleted) throw new AppError(404, 'Caso não encontrado');
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },

  async getAgenteDoCaso(req, res, next) {
    try {
      const { id } = req.params;
      const caso = await casosRepository.findById(id);
      if (!caso) throw new AppError(404, 'Caso não encontrado');

      const agente = await agentesRepository.findById(caso.agente_id);
      if (!agente) {
        throw new AppError(404, 'Agente responsável pelo caso não foi encontrado');
      }

      res.json(agente);
    } catch (err) {
      next(err);
    }
  }
};
