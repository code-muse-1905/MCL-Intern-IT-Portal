const User = require('./User');
const Asset = require('./Asset');
const Ticket = require('./Ticket');
const Document = require('./Document');
const AssetTransfer = require('./AssetTransfer');
const Maintenance = require('./Maintenance');
const Allocation = require('./Allocation');
const TicketComment = require('./TicketComment');
const Department = require('./Department');
const AssetRequest = require('./AssetRequest');

// Department associations
Department.hasMany(User, { foreignKey: 'departmentId', as: 'users' });
User.belongsTo(Department, { foreignKey: 'departmentId', as: 'dept' });

// Asset associations
Asset.belongsTo(User, { foreignKey: 'assignedTo', as: 'assignedUser' });
User.hasMany(Asset, { foreignKey: 'assignedTo', as: 'assets' });

// Ticket associations
Ticket.belongsTo(User, { foreignKey: 'raisedBy', as: 'raisedByUser' });
Ticket.belongsTo(User, { foreignKey: 'assignedTo', as: 'assignedToUser' });
Ticket.hasMany(TicketComment, { foreignKey: 'ticketId', as: 'comments' });
Ticket.belongsTo(Asset, { foreignKey: 'assignedAssetId', as: 'relatedAsset' });

// TicketComment associations
TicketComment.belongsTo(User, { foreignKey: 'userId', as: 'commentUser' });
TicketComment.belongsTo(Ticket, { foreignKey: 'ticketId', as: 'ticket' });

// Document associations
Document.belongsTo(User, { foreignKey: 'uploadedBy', as: 'uploader' });

// AssetTransfer associations
AssetTransfer.belongsTo(Asset, { foreignKey: 'assetId', as: 'asset' });
AssetTransfer.belongsTo(User, { foreignKey: 'fromUserId', as: 'fromUser' });
AssetTransfer.belongsTo(User, { foreignKey: 'toUserId', as: 'toUser' });
AssetTransfer.belongsTo(User, { foreignKey: 'transferredBy', as: 'transferredByUser' });

// Maintenance associations
Maintenance.belongsTo(Asset, { foreignKey: 'assetId', as: 'asset' });
Maintenance.belongsTo(User, { foreignKey: 'loggedBy', as: 'loggedByUser' });

// Allocation associations
Allocation.belongsTo(Asset, { foreignKey: 'assetId', as: 'asset' });
Allocation.belongsTo(User, { foreignKey: 'userId', as: 'allocatedUser' });
Allocation.belongsTo(User, { foreignKey: 'allocatedBy', as: 'allocatedByUser' });
Asset.hasMany(Allocation, { foreignKey: 'assetId', as: 'allocations' });

// AssetRequest associations
AssetRequest.belongsTo(User, { foreignKey: 'requestedBy', as: 'requester' });
AssetRequest.belongsTo(User, { foreignKey: 'reviewedBy', as: 'reviewer' });
AssetRequest.belongsTo(Asset, { foreignKey: 'assignedAssetId', as: 'assignedAsset' });

module.exports = {
  User, Asset, Ticket, Document,
  AssetTransfer, Maintenance,
  Allocation, TicketComment, Department,AssetRequest
};