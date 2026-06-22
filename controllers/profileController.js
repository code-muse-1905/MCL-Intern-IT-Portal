const bcrypt = require('bcryptjs');
const { User } = require('../models/index');

// Show profile page
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.session.user.id);
    res.render('profile/index', { profileUser: user });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong');
    res.redirect('/dashboard');
  }
};

// Update profile
exports.postProfile = async (req, res) => {
  try {
    const { name, department } = req.body;
    await User.update(
      { name, department },
      { where: { id: req.session.user.id } }
    );

    // Update session
    req.session.user.name = name;
    req.session.user.department = department;

    req.flash('success', 'Profile updated successfully!');
    res.redirect('/profile');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong');
    res.redirect('/profile');
  }
};

// Change password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    // Check new passwords match
    if (newPassword !== confirmPassword) {
      req.flash('error', 'New passwords do not match');
      return res.redirect('/profile');
    }

    // Find user
    const user = await User.findByPk(req.session.user.id);

    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      req.flash('error', 'Current password is incorrect');
      return res.redirect('/profile');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.update(
      { password: hashedPassword },
      { where: { id: req.session.user.id } }
    );

    req.flash('success', 'Password changed successfully!');
    res.redirect('/profile');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong');
    res.redirect('/profile');
  }
};