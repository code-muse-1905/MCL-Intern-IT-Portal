const { Allocation, Asset, User } = require('../models/index');

// Show allocate page
exports.getAllocate = async (req, res) => {
  try {
    const asset = await Asset.findByPk(req.params.id);
    if (!asset) {
      req.flash('error', 'Asset not found');
      return res.redirect('/assets');
    }
    const users = await User.findAll({ where: { isActive: true } });
    res.render('assets/allocate', { asset, users });
  } catch (err) {
    console.error(err);
    res.redirect('/assets');
  }
};

// Handle allocate form
exports.postAllocate = async (req, res) => {
  try {
    const { userId, department, allocationDate, note } = req.body;
    const asset = await Asset.findByPk(req.params.id);
    if (!asset) {
      req.flash('error', 'Asset not found');
      return res.redirect('/assets');
    }

    // Create allocation record
    await Allocation.create({
      assetId: asset.id,
      userId,
      department,
      allocationDate,
      note,
      allocatedBy: req.session.user.id
    });

    // Update asset
    await asset.update({
      assignedTo: userId,
      department,
      status: 'assigned'
    });

    req.flash('success', 'Asset allocated successfully!');
    res.redirect('/assets/' + asset.id);
  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong');
    res.redirect('/assets/' + req.params.id + '/allocate');
  }
};

// Show asset detail page
exports.getAssetDetail = async (req, res) => {
  try {
    const asset = await Asset.findByPk(req.params.id, {
      include: [
        { model: User, as: 'assignedUser', attributes: ['name', 'email'] }
      ]
    });
    if (!asset) {
      req.flash('error', 'Asset not found');
      return res.redirect('/assets');
    }

    const allocations = await Allocation.findAll({
      where: { assetId: req.params.id },
      include: [{ model: User, as: 'allocatedUser', attributes: ['name'] }],
      order: [['createdAt', 'DESC']]
    });

    const { AssetTransfer, Maintenance } = require('../models/index');

    const transfers = await AssetTransfer.findAll({
      where: { assetId: req.params.id },
      include: [
        { model: User, as: 'fromUser', attributes: ['name'] },
        { model: User, as: 'toUser', attributes: ['name'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    const maintenances = await Maintenance.findAll({
      where: { assetId: req.params.id },
      include: [{ model: User, as: 'loggedByUser', attributes: ['name'] }],
      order: [['maintenanceDate', 'DESC']]
    });

    res.render('assets/detail', { asset, allocations, transfers, maintenances });
  } catch (err) {
    console.error(err);
    res.redirect('/assets');
  }
};