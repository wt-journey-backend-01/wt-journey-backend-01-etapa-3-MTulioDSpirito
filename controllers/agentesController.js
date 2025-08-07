const agentesRepository = require('../repositories/agentesRepository');
const casosRepository = require('../repositories/casosRepository');
const Joi = require('joi');

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
  async getAllAgentes(req, res) {
    try {
      const { cargo, sort, dataDeIncorporacao } = req.query;
      const agentes = await agentesRepository.findAll({ cargo, sort, dataDeIncorporacao });
      res.json(agentes);
    } catch (err) {
      res.status(500).json({ message: 'Erro interno ao buscar agentes.' });
    }
  },

  async getAgenteById(req, res) {
    const { id } = req.params;
    const agente = await agentesRepository.findById(id);
    if (!agente) return res.status(404).json({ message: 'Agente não encontrado.' });
    res.json(agente);
  },

  async createAgente(req, res) {
    const { error, value } = agenteSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message }); // Mensagem de erro mais específica

    const novoAgente = await agentesRepository.create(value);
    res.status(201).json(novoAgente);
  },

  // Novo método para PUT (atualização completa)
  async putAgente(req, res) {
    const { id } = req.params;
    const { error, value } = agenteSchema.validate(req.body); // Validação de todos os campos
    if (error) return res.status(400).json({ message: error.details[0].message });

    const updated = await agentesRepository.update(id, value);
    if (!updated) return res.status(404).json({ message: 'Agente não encontrado.' });

    res.json(updated);
  },

  async patchAgente(req, res) {
    const { id } = req.params;
    const { error, value } = patchSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const updated = await agentesRepository.update(id, value);
    if (!updated) return res.status(404).json({ message: 'Agente não encontrado.' });

    res.json(updated);
  },

  async deleteAgente(req, res) {
    const deleted = await agentesRepository.remove(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Agente não encontrado.' });
    res.status(204).send();
  },

  async getCasosDoAgente(req, res) {
    const { id } = req.params;
    const agente = await agentesRepository.findById(id);
    if (!agente) return res.status(404).json({ message: 'Agente não encontrado.' });

    const casos = await casosRepository.findByAgenteId(id);
    res.json(casos);
  }
};