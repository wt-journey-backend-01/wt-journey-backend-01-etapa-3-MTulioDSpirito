const express = require('express');
const router = express.Router();
const casosController = require('../controllers/casosController');

router.get('/', casosController.getAllCasos);
router.get('/:id', casosController.getCasoById);
router.post('/', casosController.createCaso);
router.put('/:id', casosController.updateCaso);
router.delete('/:id', casosController.deleteCaso);

module.exports = router;