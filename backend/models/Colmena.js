const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Colmena = sequelize.define('Colmena', {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    id_sector: { type: DataTypes.INTEGER, allowNull: false }
}, { tableName: 'colmena', timestamps: false });

module.exports = Colmena;
