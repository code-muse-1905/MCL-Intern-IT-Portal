const { User, Asset, Ticket, Department } = require('../models/index');

// ─── DEPT USERS ───────────────────────────────────
exports.getDeptUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      where: { department: req.session.user.department }
    });
    res.render('dept/users', { users });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong');
    res.redirect('/dashboard');
  }
};

// ─── DEPT ASSETS ──────────────────────────────────
exports.getDeptAssets = async (req, res) => {
  try {
    const assets = await Asset.findAll({
      where: { department: req.session.user.department }
    });
    res.render('dept/assets', { assets });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong');
    res.redirect('/dashboard');
  }
};

// ─── DEPT TICKETS ─────────────────────────────────
exports.getDeptTickets = async (req, res) => {
  try {
    const tickets = await Ticket.findAll({
      include: [{
        model: User,
        as: 'raisedByUser',
        where: { department: req.session.user.department }
      }],
      order: [['createdAt', 'DESC']]
    });
    res.render('dept/tickets', { tickets });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong');
    res.redirect('/dashboard');
  }
};

// ─── DEPT REPORTS ─────────────────────────────────
exports.getDeptReports = async (req, res) => {
  try {
    const dept = req.session.user.department;

    const totalUsers = await User.count({ where: { department: dept } });
    const totalAssets = await Asset.count({ where: { department: dept } });
    const availableAssets = await Asset.count({ where: { department: dept, status: 'available' } });
    const assignedAssets = await Asset.count({ where: { department: dept, status: 'assigned' } });
    const maintenanceAssets = await Asset.count({ where: { department: dept, status: 'maintenance' } });

    const openTickets = await Ticket.count({
      include: [{
        model: User,
        as: 'raisedByUser',
        where: { department: dept }
      }],
      where: { status: 'open' }
    });

    const resolvedTickets = await Ticket.count({
      include: [{
        model: User,
        as: 'raisedByUser',
        where: { department: dept }
      }],
      where: { status: 'resolved' }
    });

    res.render('dept/reports', {
      dept,
      totalUsers,
      totalAssets,
      availableAssets,
      assignedAssets,
      maintenanceAssets,
      openTickets,
      resolvedTickets
    });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong');
    res.redirect('/dashboard');
  }
};

// ─── HELPDESK: VIEW DEPT TICKETS ─────────────────
exports.getHelpdesk = async (req, res) => {
  try {
    const dept = req.session.user.department;

    const tickets = await Ticket.findAll({
      where: { department: dept },
      include: [
        { model: User, as: 'raisedByUser', attributes: ['name', 'email'] },
        { model: Asset, as: 'relatedAsset', attributes: ['name', 'serialNumber'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.render('dept/helpdesk', { tickets, dept });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong');
    res.redirect('/dashboard');
  }
};

// ─── HELPDESK: APPROVE TICKET ─────────────────────
exports.postHelpdeskApprove = async (req, res) => {
  try {
    const { note } = req.body;

    await Ticket.update({
      deptAdminStatus: 'approved',
      deptAdminNote: note || null,
      superAdminStatus: 'pending'   // forward to superadmin
    }, { where: { id: req.params.id } });

    req.flash('success', 'Ticket approved and forwarded to Super Admin!');
    res.redirect('/dept/helpdesk');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong');
    res.redirect('/dept/helpdesk');
  }
};

// ─── HELPDESK: REJECT TICKET ──────────────────────
exports.postHelpdeskReject = async (req, res) => {
  try {
    const { note } = req.body;

    await Ticket.update({
      deptAdminStatus: 'rejected',
      deptAdminNote: note || null
    }, { where: { id: req.params.id } });

    req.flash('success', 'Ticket rejected!');
    res.redirect('/dept/helpdesk');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong');
    res.redirect('/dept/helpdesk');
  }
};