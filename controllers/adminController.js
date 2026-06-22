const { User } = require('../models/index');

// Show all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.render('admin/users', { users });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong');
    res.redirect('/dashboard');
  }
};

// Activate or deactivate user
exports.toggleUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      req.flash('error', 'User not found');
      return res.redirect('/admin/users');
    }
    await user.update({ isActive: !user.isActive });
    req.flash('success', `User ${user.isActive ? 'activated' : 'deactivated'} successfully!`);
    res.redirect('/admin/users');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong');
    res.redirect('/admin/users');
  }
};

// Change user role
exports.changeRole = async (req, res) => {
  try {
    const { role } = req.body;
    await User.update({ role }, { where: { id: req.params.id } });
    req.flash('success', 'User role updated!');
    res.redirect('/admin/users');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong');
    res.redirect('/admin/users');
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    await User.destroy({ where: { id: req.params.id } });
    req.flash('success', 'User deleted!');
    res.redirect('/admin/users');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong');
    res.redirect('/admin/users');
  }
};