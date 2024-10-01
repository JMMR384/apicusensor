const csv = require('csv-parser');
const fs = require('fs');
const connection = require('./db');

function cargarCSV(filePath) {
    const results = [];
    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
            results.forEach((row) => {
                // Inserción en la tabla `produccion_apicola`
                const sql = `INSERT INTO produccion_apicola (fecha, id_colmena, alza, cuadro, metodo, cuadro_reemplazo, cuadros_faltantes)
                            VALUES (?, ?, ?, ?, ?, ?, ?)`;
                const values = [row.fecha, row.id_colmena, row.alza, row.cuadro, row.metodo, row.cuadro_reemplazo, row.cuadros_faltantes];

                connection.query(sql, values, (err, results) => {
                    if (err) {
                        console.error('Error inserting data:', err);
                    }
                });
            });
            console.log('Data successfully inserted from CSV');
        });
}

module.exports = cargarCSV;
