const express = require('express');
const router = express.Router();
const casosController = require('../controllers/casosController');

router.get('/', casosController.getAllCasos);
router.get('/:id', casosController.getCasoById);
router.post('/', casosController.createCaso);
router.patch('/:id', casosController.patchCaso);
router.delete('/:id', casosController.deleteCaso);
router.get('/:id/agente', casosController.getAgenteDoCaso);

module.exports = router;
