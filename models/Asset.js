const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');

class Asset extends Model {}

Asset.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  type: { type: DataTypes.ENUM('hardware', 'software', 'network', 'other'), allowNull: false },
  serialNumber: { type: DataTypes.STRING, unique: true },
  status: {
    type: DataTypes.ENUM('available', 'assigned', 'maintenance', 'retired'),
    defaultValue: 'available'
  },
  assignedTo: { type: DataTypes.INTEGER, allowNull: true },
  purchaseDate: { type: DataTypes.DATEONLY, allowNull: true },
  description: { type: DataTypes.TEXT, allowNull: true },

  // NEW FIELDS
  specifications: { type: DataTypes.TEXT, allowNull: true },
  unit: { type: DataTypes.STRING, allowNull: true },
  quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
  storageLocation: { type: DataTypes.STRING, allowNull: true },
  unitPrice: { type: DataTypes.FLOAT, allowNull: true },
  serviceLife: { type: DataTypes.STRING, allowNull: true },
  department: { type: DataTypes.STRING, allowNull: true },
  remark: { type: DataTypes.TEXT, allowNull: true }
}, { sequelize, modelName: 'Asset' });

module.exports = Asset;