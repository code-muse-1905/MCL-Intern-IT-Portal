const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');

class Ticket extends Model {}

Ticket.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
    defaultValue: 'medium'
  },
  category: {
    type: DataTypes.ENUM('hardware', 'software', 'network', 'other'),
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('open', 'in_progress', 'resolved', 'closed'),
    defaultValue: 'open'
  },

  // ── WHO RAISED IT ──────────────────────────
  raisedBy: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  department: {
    type: DataTypes.STRING,
    allowNull: true       // auto-filled from user's dept when ticket is created
  },

  // ── ASSIGNED TO (IT Staff) ─────────────────
  assignedTo: {
    type: DataTypes.INTEGER,
    allowNull: true
  },

  // ── RELATED ASSET ──────────────────────────
  assignedAssetId: {
    type: DataTypes.INTEGER,
    allowNull: true       // which asset the complaint is about
  },

  // ── FILE UPLOADS ───────────────────────────
  docUrl: {
    type: DataTypes.STRING,
    allowNull: true       // uploaded document path
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true       // uploaded image path
  },

  // ── APPROVAL FLOW ──────────────────────────
  deptAdminStatus: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending'
  },
  deptAdminNote: {
    type: DataTypes.TEXT,
    allowNull: true       // optional note from dept admin
  },
  superAdminStatus: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending'
  },
  superAdminNote: {
    type: DataTypes.TEXT,
    allowNull: true       // optional note from superadmin
  },

  // ── RESOLVED AT ────────────────────────────
  resolvedAt: {
    type: DataTypes.DATE,
    allowNull: true
  }

}, { sequelize, modelName: 'Ticket' });

module.exports = Ticket;