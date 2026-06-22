const { Asset, User } = require('../models/index');

// Show all assets
exports.getAssets = async (req, res) => {
  try {
    const assets = await Asset.findAll({
      include: [{ model: User, as: 'assignedUser', attributes: ['name', 'email'] }]
    });
    res.render('assets/index', { assets });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong');
    res.redirect('/dashboard');
  }
};

//Show add asset page
exports.getAddAsset = async (req, res) => {
  try {
    const users = await User.findAll();
    res.render('assets/add', { users });
  } catch (err) {
    console.error(err);
    res.redirect('/assets');
  }
};

// Handle add asset form
exports.postAddAsset = async (req, res) => {
  try {
    const { name, type, serialNumber, status, assignedTo, department, purchaseDate, description } = req.body;

    await Asset.create({
      name,
      type,
      serialNumber,
      status,
      assignedTo: assignedTo || null,
      department: department || null,
      purchaseDate,
      description
    });

    req.flash('success', 'Asset added successfully!');
    res.redirect('/assets');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong');
    res.redirect('/assets/add/new');
  }
};
// Show edit asset page
exports.getEditAsset = async (req, res) => {
  try {
    const asset = await Asset.findByPk(req.params.id);
    if (!asset) {
      req.flash('error', 'Asset not found');
      return res.redirect('/assets');
    }
    const users = await User.findAll();
    res.render('assets/edit', { asset, users });
  } catch (err) {
    console.error(err);
    res.redirect('/assets');
  }
};

// Handle edit asset form
exports.postEditAsset = async (req, res) => {
  try {
    const { name, type, serialNumber, status, assignedTo, purchaseDate, description } = req.body;
    await Asset.update(
      { name, type, serialNumber, status, assignedTo: assignedTo || null, purchaseDate, description },
      { where: { id: req.params.id } }
    );
    req.flash('success', 'Asset updated successfully!');
    res.redirect('/assets');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong');
    res.redirect('/assets');
  }
};

// Delete asset
exports.deleteAsset = async (req, res) => {
  try {
    await Asset.destroy({ where: { id: req.params.id } });
    req.flash('success', 'Asset deleted!');
    res.redirect('/assets');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong');
    res.redirect('/assets');
  }
};