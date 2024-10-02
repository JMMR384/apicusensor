const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Sector = sequelize.define('Sector', {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    nombre_del_sector: { type: DataTypes.STRING }
}, { tableName: 'sector', timestamps: false });

module.exports = Sector;
