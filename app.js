const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors'); // Importa CORS para permitir solicitudes desde el frontend
const bcrypt = require('bcryptjs');

// Importar rutas
const userRoutes = require('./routes/users');
const apicolaRoutes = require('./routes/apicola');
const metricasRoutes = require('./routes/metricas');
const colmenasRoutes = require('./routes/colmenas');
const sectorRoutes = require('./routes/sector');

const app = express();

// Configuración de middlewares
app.use(cors({ origin: 'http://localhost:3000' })); // Cambia el origen a la URL de tu frontend si es necesario
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Conexión a la base de datos
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'apicunsensor'
});

db.connect((err) => {
    if (err) {
        console.error('Error de conexión a la base de datos:', err);
        return;
    }
    console.log('Conectado a la base de datos MySQL...');
});

// Usa las rutas
app.use('/users', userRoutes);
app.use('/apicola', apicolaRoutes);
app.use('/metricas', metricasRoutes);
app.use('/colmenas', colmenasRoutes);
app.use('/sector', sectorRoutes);

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor iniciado en el puerto ${PORT}`);
});
