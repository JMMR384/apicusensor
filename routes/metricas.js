const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');

// Ruta para obtener todas las métricas de una colmena
router.get('/:id_colmena', apiController.getMetricas);

// Puedes agregar otras rutas relacionadas con métricas si es necesario.

module.exports = router;
