const bcrypt = require('bcryptjs');
const { User } = require('../models/index');

// ─── SHOW LOGIN PAGE ──────────────────────────────────
exports.getLogin = (req, res) => {
  res.render('auth/login');
};

// ─── SHOW REGISTER PAGE ───────────────────────────────
exports.getRegister = (req, res) => {
  res.render('auth/register');
};

// ─── HANDLE LOGIN FORM ───────────────────────────────
exports.postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      req.flash('error', 'No account found with that email.');
      return res.redirect('/login');
    }

    if (!user.isActive) {
      req.flash('error', 'Your account has been deactivated.');
      return res.redirect('/login');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      req.flash('error', 'Incorrect password.');
      return res.redirect('/login');
    }

    req.session.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department
    };

    //req.flash('success', `Welcome back, ${user.name}!`);
    res.redirect('/dashboard');

  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong. Try again.');
    res.redirect('/login');
  }
};

// ─── HANDLE REGISTER FORM ────────────────────────────
exports.postRegister = async (req, res) => {
  try {
    const { name, email, password, role, department } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      req.flash('error', 'Email already registered.');
      return res.redirect('/register');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      department
    });

    req.flash('success', 'Registration successful! Please login.');
    res.redirect('/login');

  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong. Try again.');
    res.redirect('/register');
  }
};

// ─── LOGOUT ──────────────────────────────────────────
exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
};