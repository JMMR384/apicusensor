const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');

// Ruta para obtener todas las colmenas
router.get('/', apiController.getColmenas);

// Puedes agregar otras rutas relacionadas con colmenas si es necesario.

module.exports = router;
