const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'apicunsensor'
});

router.post('/register', async (req, res) => {
    const { nombre, email, password, rol } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = 'INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)';
    db.query(sql, [nombre, email, hashedPassword, rol], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send('Nuevo usuario creado exitosamente');
    });
});

module.exports = router;
