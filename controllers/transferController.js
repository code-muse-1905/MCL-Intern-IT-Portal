const { AssetTransfer, Asset, User } = require('../models/index');

// Show transfer page
exports.getTransfer = async (req, res) => {
  try {
    const asset = await Asset.findByPk(req.params.id, {
      include: [{ model: User, as: 'assignedUser', attributes: ['name', 'email'] }]
    });
    if (!asset) {
      req.flash('error', 'Asset not found');
      return res.redirect('/assets');
    }
    const users = await User.findAll({ where: { isActive: true } });
    res.render('assets/transfer', { asset, users });
  } catch (err) {
    console.error(err);
    res.redirect('/assets');
  }
};

// Handle transfer form
exports.postTransfer = async (req, res) => {
  try {
    const { toUserId, transferDate, reason } = req.body;
    const asset = await Asset.findByPk(req.params.id);
    if (!asset) {
      req.flash('error', 'Asset not found');
      return res.redirect('/assets');
    }

    // Log the transfer
    await AssetTransfer.create({
      assetId: asset.id,
      fromUserId: asset.assignedTo || null,
      toUserId,
      transferDate,
      reason,
      transferredBy: req.session.user.id
    });

    // Update asset assignedTo
    await asset.update({
      assignedTo: toUserId,
      status: 'assigned'
    });

    req.flash('success', 'Asset transferred successfully!');
    res.redirect('/assets');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong');
    res.redirect('/assets');
  }
};

// Show transfer history
exports.getTransferHistory = async (req, res) => {
  try {
    const transfers = await AssetTransfer.findAll({
      include: [
        { model: Asset, as: 'asset', attributes: ['name', 'serialNumber'] },
        { model: User, as: 'fromUser', attributes: ['name'] },
        { model: User, as: 'toUser', attributes: ['name'] },
        { model: User, as: 'transferredByUser', attributes: ['name'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.render('assets/transferHistory', { transfers });
  } catch (err) {
    console.error(err);
    res.redirect('/assets');
  }
};