const { Document, User } = require('../models/index');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Op } = require('sequelize');

// Setup multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'public/uploads/';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });
exports.upload = upload;

// ── SHOW ALL DOCUMENTS ────────────────────────────
exports.getDocuments = async (req, res) => {
  try {
    const user = req.session.user;
    const { search, category } = req.query;

    // Build filter
    const where = {};

    // Search by title
    if (search) {
      where.title = { [Op.like]: `%${search}%` };
    }

    // Filter by category
    if (category && category !== 'all') {
      where.category = category;
    }

    // Access control:
    // superadmin → sees all
    // admin → sees approved + their own dept + pending from their dept
    // employee → sees only approved public docs + their own uploads
    if (user.role === 'superadmin') {
      // sees everything
    } else if (user.role === 'admin') {
      where[Op.or] = [
        { status: 'approved', isPublic: true },
        { department: user.department },
        { uploadedBy: user.id }
      ];
    } else {
      where[Op.or] = [
        { status: 'approved', isPublic: true },
        { uploadedBy: user.id }
      ];
    }

    const documents = await Document.findAll({
      where,
      include: [{ model: User, as: 'uploader', attributes: ['name'] }],
      order: [['createdAt', 'DESC']]
    });

    res.render('documents/index', { documents, search: search || '', category: category || 'all' });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong');
    res.redirect('/dashboard');
  }
};

// ── SHOW UPLOAD PAGE ──────────────────────────────
exports.getUpload = (req, res) => {
  res.render('documents/upload');
};

// ── HANDLE UPLOAD ─────────────────────────────────
exports.postUpload = async (req, res) => {
  try {
    const { title, category, version, isPublic } = req.body;
    const user = req.session.user;

    if (!req.file) {
      req.flash('error', 'Please select a file to upload');
      return res.redirect('/documents/upload');
    }

    await Document.create({
      title,
      filePath: '/uploads/' + req.file.filename,
      category,
      version: version || '1.0',
      isPublic: isPublic === 'on' ? true : false,
      uploadedBy: user.id,
      department: user.department || null,
      // superadmin/admin uploads auto-approved
      status: ['superadmin', 'admin'].includes(user.role) ? 'approved' : 'pending'
    });

    req.flash('success', 'Document uploaded successfully!');
    res.redirect('/documents');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong');
    res.redirect('/documents/upload');
  }
};

// ── APPROVE DOCUMENT ──────────────────────────────
exports.approveDocument = async (req, res) => {
  try {
    await Document.update({
      status: 'approved',
      approvedBy: req.session.user.id
    }, { where: { id: req.params.id } });

    req.flash('success', 'Document approved!');
    res.redirect('/documents');
  } catch (err) {
    console.error(err);
    res.redirect('/documents');
  }
};

// ── REJECT DOCUMENT ───────────────────────────────
exports.rejectDocument = async (req, res) => {
  try {
    await Document.update({
      status: 'rejected',
      approvedBy: req.session.user.id
    }, { where: { id: req.params.id } });

    req.flash('success', 'Document rejected!');
    res.redirect('/documents');
  } catch (err) {
    console.error(err);
    res.redirect('/documents');
  }
};

// ── DELETE DOCUMENT ───────────────────────────────
exports.deleteDocument = async (req, res) => {
  try {
    const document = await Document.findByPk(req.params.id);
    if (!document) {
      req.flash('error', 'Document not found');
      return res.redirect('/documents');
    }
    const filePath = 'public' + document.filePath;
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    await Document.destroy({ where: { id: req.params.id } });
    req.flash('success', 'Document deleted!');
    res.redirect('/documents');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong');
    res.redirect('/documents');
  }
};