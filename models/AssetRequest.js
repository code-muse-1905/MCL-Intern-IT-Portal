const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');

class AssetRequest extends Model {}

AssetRequest.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  requestedBy: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  department: {
    type: DataTypes.STRING,
    allowNull: false
  },
  assetType: {
    type: DataTypes.STRING,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  reason: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected', 'assigned'),
    defaultValue: 'pending'
  },
  assignedAssetId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  reviewedBy: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  reviewNote: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, { sequelize, modelName: 'AssetRequest' });

module.exports = AssetRequest;