const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');

class Allocation extends Model {}

Allocation.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  assetId: { type: DataTypes.INTEGER, allowNull: false },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  department: { type: DataTypes.STRING, allowNull: true },
  allocationDate: { type: DataTypes.DATEONLY, allowNull: false },
  returnDate: { type: DataTypes.DATEONLY, allowNull: true },
  status: {
    type: DataTypes.ENUM('active', 'returned'),
    defaultValue: 'active'
  },
  note: { type: DataTypes.TEXT, allowNull: true },
  allocatedBy: { type: DataTypes.INTEGER, allowNull: false }
}, { sequelize, modelName: 'Allocation' });

module.exports = Allocation;