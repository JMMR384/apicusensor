const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Colmena = require('./Colmena');

const Metrica = sequelize.define('Metrica', {
    id_colmena: { type: DataTypes.INTEGER, references: { model: Colmena, key: 'id' } },
    humedad: { type: DataTypes.FLOAT },
    temperatura: { type: DataTypes.FLOAT }
}, { tableName: 'metricas', timestamps: false });

module.exports = Metrica;
