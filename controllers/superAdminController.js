const { User, Department, Asset, Ticket } = require('../models/index');

// ─── SUPER ADMIN DASHBOARD ────────────────────────
exports.getDashboard = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalDepartments = await Department.count();
    const totalAssets = await Asset.count();
    const openTickets = await Ticket.count({ where: { status: 'open' } });

    const departments = await Department.findAll({
      include: [{ model: User, as: 'users', attributes: ['id'] }]
    });

    // Asset status — doughnut
    const availableAssets = await Asset.count({ where: { status: 'available' } });
    const assignedAssets = await Asset.count({ where: { status: 'assigned' } });
    const maintenanceAssets = await Asset.count({ where: { status: 'maintenance' } });
    const retiredAssets = await Asset.count({ where: { status: 'retired' } });

    // Assets per dept — bar
    const assetsByDept = [];
    for (const dept of departments) {
      const count = await Asset.count({ where: { department: dept.name } });
      assetsByDept.push({ name: dept.name, count });
    }

    res.render('superadmin/dashboard', {
      totalUsers,
      totalDepartments,
      totalAssets,
      openTickets,
      departments,
      availableAssets,
      assignedAssets,
      maintenanceAssets,
      retiredAssets,
      assetsByDept
    });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong');
    res.redirect('/dashboard');
  }
};

// ─── DEPARTMENTS ──────────────────────────────────
exports.getDepartments = async (req, res) => {
  try {
    const departments = await Department.findAll({
      include: [{ model: User, as: 'users', attributes: ['id', 'name', 'role', 'email'] }],
      order: [['name', 'ASC']]
    });

    for (const dept of departments) {
      dept.dataValues.assetCount = await Asset.count({ where: { department: dept.name } });
      const admin = dept.users.find(u => u.role === 'admin');
      dept.dataValues.adminEmail = admin ? admin.email : null;
    }

    res.render('superadmin/departments', { departments });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong');
    res.redirect('/superadmin');
  }
};

exports.postAddDepartment = async (req, res) => {
  try {
    const { name, code, description } = req.body;
    const existing = await Department.findOne({ where: { name } });
    if (existing) {
      req.flash('error', 'Department already exists');
      return res.redirect('/superadmin/departments');
    }
    await Department.create({ name, code, description });
    req.flash('success', 'Department added successfully!');
    res.redirect('/superadmin/departments');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong');
    res.redirect('/superadmin/departments');
  }
};

exports.deleteDepartment = async (req, res) => {
  try {
    await Department.destroy({ where: { id: req.params.id } });
    req.flash('success', 'Department deleted!');
    res.redirect('/superadmin/departments');
  } catch (err) {
    console.error(err);
    res.redirect('/superadmin/departments');
  }
};

// ─── USER MANAGEMENT ─────────────────────────────
exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      include: [{ model: Department, as: 'dept', attributes: ['name'] }],
      order: [['department', 'ASC']]
    });
    const departments = await Department.findAll();
    res.render('superadmin/users', { users, departments });
  } catch (err) {
    console.error(err);
    res.redirect('/superadmin');
  }
};

exports.postAddUser = async (req, res) => {
  try {
    const { name, email, password, role, departmentId } = req.body;
    const bcrypt = require('bcryptjs');

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      req.flash('error', 'Email already exists');
      return res.redirect('/superadmin/users');
    }

    const dept = await Department.findByPk(departmentId);
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      departmentId,
      department: dept ? dept.name : null
    });

    req.flash('success', 'User added successfully!');
    res.redirect('/superadmin/users');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong');
    res.redirect('/superadmin/users');
  }
};

exports.toggleUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    await user.update({ isActive: !user.isActive });
    req.flash('success', `User ${user.isActive ? 'activated' : 'deactivated'}!`);
    res.redirect('/superadmin/users');
  } catch (err) {
    console.error(err);
    res.redirect('/superadmin/users');
  }
};

exports.changeRole = async (req, res) => {
  try {
    const { role } = req.body;
    await User.update({ role }, { where: { id: req.params.id } });
    req.flash('success', 'Role updated!');
    res.redirect('/superadmin/users');
  } catch (err) {
    console.error(err);
    res.redirect('/superadmin/users');
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.destroy({ where: { id: req.params.id } });
    req.flash('success', 'User deleted!');
    res.redirect('/superadmin/users');
  } catch (err) {
    console.error(err);
    res.redirect('/superadmin/users');
  }
};

// ─── VIEW SINGLE DEPARTMENT ───────────────────────
exports.getDepartmentView = async (req, res) => {
  try {
    const dept = await Department.findByPk(req.params.id, {
      include: [{ model: User, as: 'users', attributes: ['id', 'name', 'email', 'role', 'isActive'] }]
    });

    if (!dept) {
      req.flash('error', 'Department not found');
      return res.redirect('/superadmin/departments');
    }

    const assets = await Asset.findAll({ where: { department: dept.name } });

    const tickets = await Ticket.findAll({
      include: [{
        model: User,
        as: 'raisedByUser',
        where: { department: dept.name },
        attributes: ['name']
      }],
      order: [['createdAt', 'DESC']],
      limit: 10
    });

    res.render('superadmin/departmentView', { dept, assets, tickets });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong');
    res.redirect('/superadmin/departments');
  }
};

// ─── SHOW EDIT FORM ───────────────────────────────
exports.getDepartmentEdit = async (req, res) => {
  try {
    const dept = await Department.findByPk(req.params.id);
    if (!dept) {
      req.flash('error', 'Department not found');
      return res.redirect('/superadmin/departments');
    }

    const deptUsers = await User.findAll({ where: { department: dept.name } });
    res.render('superadmin/departmentEdit', { dept, deptUsers });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong');
    res.redirect('/superadmin/departments');
  }
};

// ─── HANDLE EDIT FORM ────────────────────────────
exports.postDepartmentEdit = async (req, res) => {
  try {
    const { name, code, description, isActive, adminUserId } = req.body;

    const dept = await Department.findByPk(req.params.id);
    if (!dept) {
      req.flash('error', 'Department not found');
      return res.redirect('/superadmin/departments');
    }

    const oldName = dept.name;

    await dept.update({
      name,
      code,
      description,
      isActive: isActive === 'on'
    });

    if (oldName !== name) {
      await User.update({ department: name }, { where: { department: oldName } });
      await Asset.update({ department: name }, { where: { department: oldName } });
    }

    if (adminUserId) {
      await User.update(
        { role: 'employee' },
        { where: { department: name, role: 'admin' } }
      );
      await User.update(
        { role: 'admin' },
        { where: { id: adminUserId } }
      );
    }

    req.flash('success', 'Department updated successfully!');
    res.redirect('/superadmin/departments');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong');
    res.redirect('/superadmin/departments');
  }
};

// ─── HELPDESK: VIEW ALL TICKETS ───────────────────
exports.getHelpdesk = async (req, res) => {
  try {
    const departments = await Department.findAll();

    // For each dept, get their tickets
    const deptTickets = [];
    for (const dept of departments) {
      const tickets = await Ticket.findAll({
        where: { department: dept.name },
        include: [
          { model: User, as: 'raisedByUser', attributes: ['name', 'email'] },
          { model: Asset, as: 'relatedAsset', attributes: ['name', 'serialNumber'] }
        ],
        order: [['createdAt', 'DESC']]
      });

      deptTickets.push({
        deptName: dept.name,
        tickets
      });
    }

    res.render('superadmin/helpdesk', { deptTickets });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong');
    res.redirect('/superadmin');
  }
};

// ─── HELPDESK: UPDATE STATUS ──────────────────────
exports.postUpdateHelpdeskStatus = async (req, res) => {
  try {
    const { status, note } = req.body;

    await Ticket.update({
      superAdminStatus: status,
      superAdminNote: note || null,
      // If superadmin resolves it, mark ticket as resolved too
      status: status === 'approved' ? 'resolved' : 'open',
      resolvedAt: status === 'approved' ? new Date() : null
    }, { where: { id: req.params.id } });

    req.flash('success', `Ticket ${status} successfully!`);
    res.redirect('/superadmin/helpdesk');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong');
    res.redirect('/superadmin/helpdesk');
  }
};