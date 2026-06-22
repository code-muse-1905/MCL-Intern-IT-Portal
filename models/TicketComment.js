const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');

class TicketComment extends Model {}

TicketComment.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  ticketId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, { sequelize, modelName: 'TicketComment' });

module.exports = TicketComment;