// Check if logged in
module.exports.isAuthenticated = (req, res, next) => {
  if (req.session.user) return next();
  req.flash('error', 'Please login to continue');
  res.redirect('/login');
};

// Only superadmin
module.exports.isSuperAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'superadmin') return next();
  req.flash('error', 'Access denied — Super Admin only');
  res.redirect('/dashboard');
};

// Superadmin or admin
module.exports.isAdmin = (req, res, next) => {
  const allowed = ['superadmin', 'admin'];
  if (req.session.user && allowed.includes(req.session.user.role)) return next();
  req.flash('error', 'Access denied — Admin only');
  res.redirect('/dashboard');
};

// Superadmin or admin — used for asset/ticket management
module.exports.isITStaff = (req, res, next) => {
  const allowed = ['superadmin', 'admin'];
  if (req.session.user && allowed.includes(req.session.user.role)) return next();
  req.flash('error', 'Access denied');
  res.redirect('/dashboard');
};

// Only dept admin (NOT superadmin)
module.exports.isDeptAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'admin') return next();
  req.flash('error', 'Access denied — Department Admin only');
  res.redirect('/dashboard');
};