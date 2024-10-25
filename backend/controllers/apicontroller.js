// Importar servicios y modelos
const dataUploadService = require('../services/dataUploadService');
const predictionService = require('../services/predictionService');  // Servicio de predicción en Python o Node.js
const Colmena = require('../models/Colmena');
const Metrica = require('../models/Metrica');
const Usuarios = require('../models/Usuario');
const Sector = require('../models/Sector');

// Controlador para manejar la carga del archivo CSV
exports.uploadCSV = async (req, res) => {
  try {
    const result = await dataUploadService.processCSV(req.file.path); // Procesar el archivo CSV
    res.status(200).json({
      message: "Archivo CSV cargado y procesado exitosamente.",
      data: result
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al cargar el archivo CSV.",
      error: error.message
    });
  }
};

// Controlador para obtener los datos de las colmenas
exports.getColmenas = async (req, res) => {
  try {
    const colmenas = await Colmena.findAll(); // Obtener todas las colmenas
    res.status(200).json({
      data: colmenas
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener los datos de las colmenas.",
      error: error.message
    });
  }
};

// Controlador para obtener métricas (humedad y temperatura)
exports.getMetricas = async (req, res) => {
  try {
    const metricas = await Metrica.findAll({
      where: {
        id_colmena: req.params.id_colmena // Filtrar por id de la colmena
      }
    });
    res.status(200).json({
      data: metricas
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener las métricas.",
      error: error.message
    });
  }
};

// Controlador para ejecutar predicciones de tendencia
exports.getTendencias = async (req, res) => {
  try {
    const { id_colmena } = req.params;

    // Consulta las métricas para esa colmena como datos de entrada
    const metricas = await Metrica.findAll({
      where: {
        id_colmena: id_colmena
      }
    });

    if (!metricas.length) {
      return res.status(404).json({ message: "No se encontraron métricas para la colmena especificada." });
    }

    // Enviar métricas para predecir tendencias
    const tendencias = await predictionService.obtenerTendencia(metricas); // Llamar a la función de predicción
    res.status(200).json({
      data: tendencias
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al predecir tendencias.",
      error: error.message
    });
  }
};

// Controlador para agregar usuarios
exports.createUser = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;
    const newUser = await Usuarios.create({ nombre, email, password, rol });
    res.status(201).json({
      message: "Usuario creado exitosamente.",
      data: newUser
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al crear usuario.",
      error: error.message
    });
  }
};

// Controlador para obtener los sectores
exports.getSectors = async (req, res) => {
  try {
    const sectores = await Sector.findAll();
    res.status(200).json({
      data: sectores
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener los sectores.",
      error: error.message
    });
  }
};
