const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'apicunsensor'
});

router.post('/produccion', (req, res) => {
    const { fecha, id_colmena, alza, cuadro, metodo, cuadro_reemplazo, cuadros_faltantes } = req.body;

    const sql = 'INSERT INTO produccion_apicola (fecha, id_colmena, alza, cuadro, metodo, cuadro_reemplazo, cuadros_faltantes) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [fecha, id_colmena, alza, cuadro, metodo, cuadro_reemplazo, cuadros_faltantes], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send('Nuevo registro de producción apícola creado exitosamente');
    });
});

module.exports = router;
