const { Maintenance, Asset, User } = require('../models/index');

// Show maintenance log page
exports.getMaintenance = async (req, res) => {
  try {
    const asset = await Asset.findByPk(req.params.id);
    if (!asset) {
      req.flash('error', 'Asset not found');
      return res.redirect('/assets');
    }
    const records = await Maintenance.findAll({
      where: { assetId: req.params.id },
      include: [{ model: User, as: 'loggedByUser', attributes: ['name'] }],
      order: [['maintenanceDate', 'DESC']]
    });
    res.render('assets/maintenance', { asset, records });
  } catch (err) {
    console.error(err);
    res.redirect('/assets');
  }
};

// Handle maintenance form
exports.postMaintenance = async (req, res) => {
  try {
    const { description, maintenanceDate, cost, performedBy, status } = req.body;
    await Maintenance.create({
      assetId: req.params.id,
      description,
      maintenanceDate,
      cost: cost || null,
      performedBy,
      status,
      loggedBy: req.session.user.id
    });

    // Update asset status to maintenance
    await Asset.update(
      { status: 'maintenance' },
      { where: { id: req.params.id } }
    );

    req.flash('success', 'Maintenance record added!');
    res.redirect('/assets/maintenance/' + req.params.id);
  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong');
    res.redirect('/assets/maintenance/' + req.params.id);
  }
};

// Delete maintenance record
exports.deleteMaintenance = async (req, res) => {
  try {
    const record = await Maintenance.findByPk(req.params.recordId);
    if (!record) {
      req.flash('error', 'Record not found');
      return res.redirect('/assets');
    }
    await Maintenance.destroy({ where: { id: req.params.recordId } });
    req.flash('success', 'Record deleted!');
    res.redirect('/assets/maintenance/' + req.params.assetId);
  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong');
    res.redirect('/assets');
  }
};