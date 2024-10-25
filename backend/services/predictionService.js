const axios = require('axios');

async function obtenerTendencia(datos) {
    try {
        const respuesta = await axios.post('http://localhost:5001/predict', datos);
        return respuesta.data;  // Retorna la tendencia
    } catch (error) {
        console.error("Error al conectar con el servicio de predicción:", error);
        throw error;
    }
}

module.exports = { obtenerTendencia };
