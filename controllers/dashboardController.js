const { User, Asset, Ticket, Document, Department } = require('../models/index');

exports.getDashboard = async (req, res) => {
  try {
    const role = req.session.user.role;

    // ── SUPERADMIN ────────────────────────────────
    if (role === 'superadmin') {
      return res.redirect('/superadmin');
    }

    // ── DEPT ADMIN ────────────────────────────────
    if (role === 'admin') {
      const dept = req.session.user.department;

      const totalUsers = await User.count({ where: { department: dept } });
      const totalAssets = await Asset.count({ where: { department: dept } });
      const totalDocuments = await Document.count();

      const availableAssets = await Asset.count({ where: { department: dept, status: 'available' } });
      const assignedAssets = await Asset.count({ where: { department: dept, status: 'assigned' } });
      const maintenanceAssets = await Asset.count({ where: { department: dept, status: 'maintenance' } });

      const openTickets = await Ticket.count({ where: { department: dept, status: 'open' } });
      const inProgressTickets = await Ticket.count({ where: { department: dept, status: 'in_progress' } });
      const resolvedTickets = await Ticket.count({ where: { department: dept, status: 'resolved' } });
      const closedTickets = await Ticket.count({ where: { department: dept, status: 'closed' } });

      return res.render('dashboard/index', {
        user: req.session.user,
        totalUsers,
        totalAssets,
        totalDocuments,
        totalDepartments: 0,
        openTickets,
        inProgressTickets,
        resolvedTickets,
        closedTickets,
        availableAssets,
        assignedAssets,
        maintenanceAssets,
        departments: [],
        role: 'admin'
      });
    }

    // ── EMPLOYEE ──────────────────────────────────
    const myTickets = await Ticket.count({ where: { raisedBy: req.session.user.id } });
    const myAssets = await Asset.count({ where: { assignedTo: req.session.user.id } });
    const totalDocuments = await Document.count();

    return res.render('dashboard/index', {
      user: req.session.user,
      totalUsers: 0,
      totalAssets: myAssets,
      openTickets: myTickets,
      totalDepartments: 0,
      totalDocuments,
      departments: [],
      availableAssets: 0,
      assignedAssets: 0,
      maintenanceAssets: 0,
      inProgressTickets: 0,
      resolvedTickets: 0,
      closedTickets: 0,
      role: 'employee'
    });

  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong');
    res.redirect('/login');
  }
};