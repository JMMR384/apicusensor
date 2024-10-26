const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');

// Ruta para obtener todos los sectores
router.get('/', apiController.getSectors);

// Puedes agregar otras rutas relacionadas con sectores si es necesario.

module.exports = router;
