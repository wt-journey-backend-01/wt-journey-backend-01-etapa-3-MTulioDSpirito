const Joi = require('joi');
const agentesRepository = require('../repositories/agentesRepository');
const casosRepository = require('../repositories/casosRepository');
const { AppError } = require('../utils/errorHandler');

const agenteSchema = Joi.object({
  nome: Joi.string().min(3).max(50).required(),
  dataDeIncorporacao: Joi.date().iso().required()
    .messages({
      'date.base': 'Data de incorporação deve ser uma data válida.',
      'date.format': 'Formato esperado: yyyy-mm-dd.'
    }),
  cargo: Joi.string().required()
});

const patchSchema = Joi.object({
  nome: Joi.string().min(3).max(50),
  dataDeIncorporacao: Joi.date().iso()
    .messages({ 'date.format': 'Formato esperado: yyyy-mm-dd.' }),
  cargo: Joi.string()
}).min(1);

const querySchema = Joi.object({
  cargo: Joi.string(),
  sort: Joi.string().pattern(/^-?(nome|dataDeIncorporacao|cargo)$/),
  dataDeIncorporacao: Joi.date().iso()
});

module.exports = {
  async getAllAgentes(req, res, next) {
    try {
      const { cargo, sort, dataDeIncorporacao } = req.query;
      const agentes = await agentesRepository.findAll({ cargo, sort, dataDeIncorporacao });
      res.json(agentes);
    } catch (err) {
      next(new AppError(500, 'Erro interno ao buscar agentes'));
    }
  },

  async getAgenteById(req, res, next) {
    try {
      const { id } = req.params;
      const agente = await agentesRepository.findById(id);
      if (!agente) throw new AppError(404, 'Agente não encontrado');
      res.json(agente);
    } catch (err) {
      next(err);
    }
  },

  async createAgente(req, res, next) {
    try {
      const { error, value } = agenteSchema.validate(req.body);
      if (error) throw new AppError(400, error.details[0].message);

      const novoAgente = await agentesRepository.create(value);
      res.status(201).json(novoAgente);
    } catch (err) {
      next(err);
    }
  },

  async putAgente(req, res, next) {
    try {
      const { id } = req.params;
      const { error, value } = agenteSchema.validate(req.body);
      if (error) throw new AppError(400, error.details[0].message);

      const updated = await agentesRepository.update(id, value);
      if (!updated) throw new AppError(404, 'Agente não encontrado');

      res.json(updated);
    } catch (err) {
      next(err);
    }
  },

  async patchAgente(req, res, next) {
    try {
      const { id } = req.params;
      const { error, value } = patchSchema.validate(req.body);
      if (error) throw new AppError(400, error.details[0].message);

      const updated = await agentesRepository.update(id, value);
      if (!updated) throw new AppError(404, 'Agente não encontrado');

      res.json(updated);
    } catch (err) {
      next(err);
    }
  },

  async deleteAgente(req, res, next) {
    try {
      const deleted = await agentesRepository.remove(req.params.id);
      if (!deleted) throw new AppError(404, 'Agente não encontrado');
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },

  async getCasosDoAgente(req, res, next) {
    try {
      const { id } = req.params;
      const agente = await agentesRepository.findById(id);

      if (!agente) throw new AppError(404, 'Agente não encontrado');

      const casos = await casosRepository.findByAgenteId(id);
      res.json(casos);
    } catch (err) {
      next(err);
    }
  }
};
