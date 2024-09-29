// server.js
const express = require('express');
const db = require('./db'); // Importa la conexión a la base de datos
const app = express();
const port = 3000;

// Middleware para parsear JSON
app.use(express.json());

// Endpoint para obtener todas las colmenas
app.get('/colmenas', (req, res) => {
    const query = 'SELECT colmena.id, sector.nombre_del_sector, descripcion FROM colmena JOIN sector ON colmena.id_sector = sector.id';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error fetching colmenas' });
        }
        res.status(200).json(results);
    });
});

// Endpoint para agregar una colmena
app.post('/colmena', (req, res) => {
    const { id, id_sector, descripcion } = req.body;
    const query = 'INSERT INTO colmena (id, id_sector, descripcion) VALUES (?, ?, ?)';
    db.query(query, [id, id_sector, descripcion], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error adding colmena' });
        }
        res.status(201).json({ message: 'Colmena added successfully!' });
    });
});

// Endpoint para obtener las métricas de una colmena
app.get('/metricas/:id_colmena', (req, res) => {
    const { id_colmena } = req.params;
    const query = 'SELECT * FROM metricas WHERE id_colmena = ?';
    db.query(query, [id_colmena], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error fetching metricas' });
        }
        res.status(200).json(results);
    });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
