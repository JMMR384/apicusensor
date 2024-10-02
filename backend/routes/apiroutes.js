const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apicontroller.js');

// Definir las rutas y conectarlas con los controladores
router.post('/upload', apiController.uploadCSV); // Carga de CSV
router.get('/colmenas', apiController.getColmenas); // Obtener colmenas
router.get('/metricas/:id_colmena', apiController.getMetricas); // Obtener métricas por colmena
router.get('/produccion/:id_colmena', apiController.getProduccionApicola); // Obtener producción apícola por colmena
router.get('/tendencias/:id_colmena', apiController.getTendencias); // Obtener predicciones de tendencias
router.post('/usuario', apiController.createUser); // Crear usuario
router.get('/sectores', apiController.getSectors); // Obtener sectores

module.exports = router;
