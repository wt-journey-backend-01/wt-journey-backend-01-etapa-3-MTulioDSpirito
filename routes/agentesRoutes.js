const express = require('express');
const router = express.Router();
const agentesController = require('../controllers/agentesController');

router.get('/', agentesController.getAllAgentes);
router.get('/:id', agentesController.getAgenteById);
router.post('/', agentesController.createAgente);
router.patch('/:id', agentesController.patchAgente);
router.delete('/:id', agentesController.deleteAgente);

// Bônus
router.get('/:id/casos', agentesController.getCasosDoAgente);

module.exports = router;
