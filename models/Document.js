const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');

class Document extends Model {}

Document.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  filePath: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category: {
    type: DataTypes.ENUM('policy', 'manual', 'report', 'other'),
    defaultValue: 'other'
  },
  uploadedBy: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  version: {
    type: DataTypes.STRING,
    defaultValue: '1.0'
  },
  isPublic: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  department: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending'
  },
  approvedBy: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, { sequelize, modelName: 'Document' });

module.exports = Document;