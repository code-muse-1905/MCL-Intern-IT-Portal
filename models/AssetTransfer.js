const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');

class AssetTransfer extends Model {}

AssetTransfer.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  assetId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  fromUserId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  toUserId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  transferDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  reason: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  transferredBy: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, { sequelize, modelName: 'AssetTransfer' });

module.exports = AssetTransfer;