const casosRepository = require('../repositories/casosRepository');
const agentesRepository = require('../repositories/agentesRepository');
const Joi = require('joi');

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
  async getAllCasos(req, res) {
    const { status, q } = req.query;
    if (q !== undefined && q.trim() === '') {
      return res.status(400).json({ message: "O parâmetro 'q' não pode ser vazio." });
    }

    const casos = await casosRepository.findAll({ status, q });
    res.json(casos);
  },

  async getCasoById(req, res) {
    const { id } = req.params;
    const caso = await casosRepository.findById(id);
    if (!caso) return res.status(404).json({ message: 'Caso não encontrado.' });
    res.json(caso);
  },

  async createCaso(req, res) {
    const { error, value } = casoSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const agente = await agentesRepository.findById(value.agente_id);
    if (!agente) return res.status(404).json({ message: 'Agente atribuído não encontrado.' });

    const novoCaso = await casosRepository.create(value);
    res.status(201).json(novoCaso);
  },

  // Novo método para PUT (atualização completa)
  async putCaso(req, res) {
    const { id } = req.params;
    const { error, value } = casoSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const updated = await casosRepository.update(id, value);
    if (!updated) return res.status(404).json({ message: 'Caso não encontrado.' });

    res.json(updated);
  },

  async patchCaso(req, res) {
    const { id } = req.params;
    const { error, value } = patchSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const updated = await casosRepository.update(id, value);
    if (!updated) return res.status(404).json({ message: 'Caso não encontrado.' });

    res.json(updated);
  },

  async deleteCaso(req, res) {
    const deleted = await casosRepository.remove(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Caso não encontrado.' });
    res.status(204).send();
  },

  async getAgenteDoCaso(req, res) {
    const { id } = req.params;
    const caso = await casosRepository.findById(id);
    if (!caso) return res.status(404).json({ message: 'Caso não encontrado.' });

    const agente = await agentesRepository.findById(caso.agente_id);
    if (!agente) {
      return res.status(404).json({ message: 'Agente responsável pelo caso não foi encontrado.' });
    }

    res.json(agente);
  }
};