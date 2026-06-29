const { Ticket, User, TicketComment, Asset } = require('../models/index');

// ─── GET CREATE TICKET FORM ───────────────────────
exports.getCreateTicket = async (req, res) => {
  try {
    const userId = req.session.user.id;

    // Fetch only assets assigned to this user
    const myAssets = await Asset.findAll({
      where: { assignedTo: userId }
    });

    res.render('tickets/create', { myAssets });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong');
    res.redirect('/tickets');
  }
};

// ─── POST CREATE TICKET ───────────────────────────
exports.postCreateTicket = async (req, res) => {
  try {
    const { title, description, priority, category, assignedAssetId } = req.body;
    const user = req.session.user;

    // Handle uploaded files
    const imageUrl = req.files?.imageUrl
      ? '/uploads/' + req.files.imageUrl[0].filename
      : null;
    const docUrl = req.files?.docUrl
      ? '/uploads/' + req.files.docUrl[0].filename
      : null;

      // Add this before Ticket.create(...)
if (!category || category === '') {
  req.flash('error', 'Please select a category');
  return res.redirect('back');
}

    await Ticket.create({
      title,
      description,
      priority,
      category,
      assignedAssetId: assignedAssetId || null,
      imageUrl,
      docUrl,
      raisedBy: user.id,
      department: user.department,   // auto-filled from session
      deptAdminStatus: 'pending',
      superAdminStatus: 'pending'
    });

    req.flash('success', 'Ticket raised successfully!');
    res.redirect('/tickets');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong');
    res.redirect('/tickets/create');
  }
};

// ─── GET MY TICKETS ───────────────────────────────
exports.getTickets = async (req, res) => {
  try {
    const userId = req.session.user.id;

    const tickets = await Ticket.findAll({
      where: { raisedBy: userId },
      include: [
        { model: User, as: 'raisedByUser', attributes: ['name', 'email'] },
        { model: User, as: 'assignedToUser', attributes: ['name', 'email'] },
        { model: Asset, as: 'relatedAsset', attributes: ['name', 'serialNumber'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.render('tickets/myTickets', { tickets });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong');
    res.redirect('/dashboard');
  }
};

// ─── GET VIEW SINGLE TICKET ───────────────────────
exports.getViewTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByPk(req.params.id, {
      include: [
        { model: User, as: 'raisedByUser', attributes: ['name', 'email'] },
        { model: User, as: 'assignedToUser', attributes: ['name', 'email'] },
        { model: Asset, as: 'relatedAsset', attributes: ['name', 'serialNumber'] },
        {
          model: TicketComment,
          as: 'comments',
          include: [{ model: User, as: 'commentUser', attributes: ['name', 'role'] }],
          order: [['createdAt', 'ASC']]
        }
      ]
    });

    if (!ticket) {
      req.flash('error', 'Ticket not found');
      return res.redirect('/tickets');
    }

    const users = await User.findAll({
      where: { role: ['it_staff', 'admin'] }
    });

    res.render('tickets/view', { ticket, users });
  } catch (err) {
    console.error(err);
    res.redirect('/tickets');
  }
};

// ─── POST UPDATE TICKET (IT Staff / Admin) ────────
exports.postUpdateTicket = async (req, res) => {
  try {
    const { status, assignedTo } = req.body;
    const updateData = { status, assignedTo: assignedTo || null };
    if (status === 'resolved') updateData.resolvedAt = new Date();

    await Ticket.update(updateData, { where: { id: req.params.id } });
    req.flash('success', 'Ticket updated successfully!');
    res.redirect('/tickets/' + req.params.id);
  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong');
    res.redirect('/tickets');
  }
};

// ─── POST COMMENT ─────────────────────────────────
exports.postComment = async (req, res) => {
  try {
    const { comment } = req.body;
    await TicketComment.create({
      ticketId: req.params.id,
      userId: req.session.user.id,
      comment
    });
    req.flash('success', 'Comment added!');
    res.redirect('/tickets/' + req.params.id);
  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong');
    res.redirect('/tickets/' + req.params.id);
  }
};

// ─── DELETE COMMENT ───────────────────────────────
exports.deleteComment = async (req, res) => {
  try {
    await TicketComment.destroy({ where: { id: req.params.commentId } });
    req.flash('success', 'Comment deleted!');
    res.redirect('/tickets/' + req.params.id);
  } catch (err) {
    console.error(err);
    res.redirect('/tickets/' + req.params.id);
  }
};

// ─── DELETE TICKET ────────────────────────────────
exports.deleteTicket = async (req, res) => {
  try {
    await Ticket.destroy({ where: { id: req.params.id } });
    req.flash('success', 'Ticket deleted!');
    res.redirect('/tickets');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong');
    res.redirect('/tickets');
  }
};