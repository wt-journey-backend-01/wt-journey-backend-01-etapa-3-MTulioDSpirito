const express = require('express');
const router = express.Router();
const casosController = require('../controllers/casosController');

/**
 * @swagger
 * /casos:
 *   get:
 *     summary: Lista todos os casos
 *     tags: [Casos]
 *     description: >
 *       Retorna uma lista de casos policiais. É possível filtrar por status, agente responsável e busca textual no título ou descrição.
 *       A busca textual é case-insensitive e permite trechos parciais.
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [aberto, em andamento, solucionado]
 *         required: false
 *         description: Filtra os casos pelo status atual.
 *       - in: query
 *         name: agente_id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: false
 *         description: Filtra os casos pelo ID do agente responsável.
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         required: false
 *         description: Termo de busca textual no título ou descrição (case-insensitive).
 *     responses:
 *       200:
 *         description: Lista de casos retornada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Caso'
 *       400:
 *         description: Parâmetros inválidos.
 */
router.get('/', casosController.getAllCasos);

/**
 * @swagger
 * /casos:
 *   post:
 *     summary: Cria um novo caso policial
 *     tags: [Casos]
 *     description: Cadastra um novo caso no sistema.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CasoInput'
 *           example:
 *             titulo: "Roubo no Banco Central"
 *             descricao: "Suspeitos armados invadiram a agência central."
 *             status: "aberto"
 *             agente_id: "a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6"
 *     responses:
 *       201:
 *         description: Caso criado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Caso'
 *       400:
 *         description: Dados inválidos.
 */
router.post('/', casosController.createCaso);

/**
 * @swagger
 * /casos/{id}:
 *   get:
 *     summary: Retorna um caso específico
 *     tags: [Casos]
 *     description: Busca e retorna um caso pelo seu ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID do caso.
 *     responses:
 *       200:
 *         description: Caso encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Caso'
 *       404:
 *         description: Caso não encontrado.
 */
router.get('/:id', casosController.getCasoById);

/**
 * @swagger
 * /casos/{id}/agente:
 *   get:
 *     summary: Retorna o agente responsável por um caso
 *     tags: [Casos]
 *     description: Retorna os dados completos do agente responsável por um caso específico.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID do caso.
 *     responses:
 *       200:
 *         description: Dados do agente retornados com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Agente'
 *       404:
 *         description: Caso ou agente não encontrado.
 */
router.get('/:id/agente', casosController.getAgenteDoCaso);

/**
 * @swagger
 * /casos/{id}:
 *   put:
 *     summary: Atualiza um caso por completo
 *     tags: [Casos]
 *     description: Substitui todos os dados do caso com os dados fornecidos.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID do caso a ser atualizado.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CasoInput'
 *     responses:
 *       200:
 *         description: Caso atualizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Caso'
 *       400:
 *         description: Dados inválidos.
 *       404:
 *         description: Caso não encontrado.
 */
router.put('/:id', casosController.putCaso);

/**
 * @swagger
 * /casos/{id}:
 *   patch:
 *     summary: Atualiza um caso parcialmente
 *     tags: [Casos]
 *     description: Atualiza um ou mais campos do caso.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID do caso a ser atualizado.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               descricao:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [aberto, em andamento, solucionado]
 *               agente_id:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       200:
 *         description: Caso atualizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Caso'
 *       404:
 *         description: Caso não encontrado.
 */
router.patch('/:id', casosController.patchCaso);

/**
 * @swagger
 * /casos/{id}:
 *   delete:
 *     summary: Remove um caso
 *     tags: [Casos]
 *     description: Remove um caso pelo seu ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID do caso a ser removido.
 *     responses:
 *       204:
 *         description: Caso removido com sucesso (sem conteúdo).
 *       404:
 *         description: Caso não encontrado.
 */
router.delete('/:id', casosController.deleteCaso);

module.exports = router;
