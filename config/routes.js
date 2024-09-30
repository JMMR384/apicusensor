const express = require('express');
const cargarCSV = require('./controllers/cargarCSV');
const router = express.Router();

router.post('/cargar-datos', (req, res) => {
    const filePath = req.file.path; // Archivo CSV subido
    cargarCSV(filePath);
    res.send('Datos cargados exitosamente.');
});

module.exports = router;
