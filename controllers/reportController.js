const { User, Asset, Ticket, Department, Document } = require('../models/index');

// ── MAIN REPORTS PAGE ─────────────────────────────
exports.getReports = async (req, res) => {
  try {
    res.render('reports/index');
  } catch (err) {
    console.error(err);
    res.redirect('/dashboard');
  }
};

// ── ASSET INVENTORY REPORT ────────────────────────
exports.getAssetReport = async (req, res) => {
  try {
    const { department } = req.query;

    const where = {};
    if (department && department !== 'all') {
      where.department = department;
    }

    const assets = await Asset.findAll({
      where,
      include: [{ model: User, as: 'assignedUser', attributes: ['name'] }],
      order: [['department', 'ASC'], ['name', 'ASC']]
    });

    const departments = await Department.findAll({ order: [['name', 'ASC']] });

    // Summary counts
    const totalAssets = assets.length;
    const availableAssets = assets.filter(a => a.status === 'available').length;
    const assignedAssets = assets.filter(a => a.status === 'assigned').length;
    const maintenanceAssets = assets.filter(a => a.status === 'maintenance').length;
    const retiredAssets = assets.filter(a => a.status === 'retired').length;

    res.render('reports/assets', {
      assets,
      departments,
      totalAssets,
      availableAssets,
      assignedAssets,
      maintenanceAssets,
      retiredAssets,
      selectedDept: department || 'all'
    });
  } catch (err) {
    console.error(err);
    res.redirect('/reports');
  }
};

// ── USER REPORT ───────────────────────────────────
exports.getUserReport = async (req, res) => {
  try {
    const { department } = req.query;

    const where = {};
    if (department && department !== 'all') {
      where.department = department;
    }

    const users = await User.findAll({
      where,
      order: [['department', 'ASC'], ['name', 'ASC']]
    });

    const departments = await Department.findAll({ order: [['name', 'ASC']] });

    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.isActive).length;
    const inactiveUsers = users.filter(u => !u.isActive).length;
    const adminUsers = users.filter(u => u.role === 'admin').length;
    const employeeUsers = users.filter(u => u.role === 'employee').length;

    res.render('reports/users', {
      users,
      departments,
      totalUsers,
      activeUsers,
      inactiveUsers,
      adminUsers,
      employeeUsers,
      selectedDept: department || 'all'
    });
  } catch (err) {
    console.error(err);
    res.redirect('/reports');
  }
};

// ── TICKET REPORT ─────────────────────────────────
exports.getTicketReport = async (req, res) => {
  try {
    const { department } = req.query;

    const where = {};
    if (department && department !== 'all') {
      where.department = department;
    }

    const tickets = await Ticket.findAll({
      where,
      include: [
        { model: User, as: 'raisedByUser', attributes: ['name', 'department'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    const departments = await Department.findAll({ order: [['name', 'ASC']] });

    const totalTickets = tickets.length;
    const openTickets = tickets.filter(t => t.status === 'open').length;
    const inProgressTickets = tickets.filter(t => t.status === 'in_progress').length;
    const resolvedTickets = tickets.filter(t => t.status === 'resolved').length;
    const closedTickets = tickets.filter(t => t.status === 'closed').length;

    res.render('reports/tickets', {
      tickets,
      departments,
      totalTickets,
      openTickets,
      inProgressTickets,
      resolvedTickets,
      closedTickets,
      selectedDept: department || 'all'
    });
  } catch (err) {
    console.error(err);
    res.redirect('/reports');
  }
};