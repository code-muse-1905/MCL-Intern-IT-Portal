const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');

class Maintenance extends Model {}

Maintenance.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  assetId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  maintenanceDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  cost: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  performedBy: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('scheduled', 'in_progress', 'completed'),
    defaultValue: 'completed'
  },
  loggedBy: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, { sequelize, modelName: 'Maintenance' });

module.exports = Maintenance;