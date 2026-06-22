const { AssetRequest, User, Asset } = require('../models/index');

// ─── EMPLOYEE — Create Request ────────────────────
exports.getCreateRequest = (req, res) => {
  res.render('requests/create');
};

exports.postCreateRequest = async (req, res) => {
  try {
    const { assetType, quantity, reason } = req.body;
    await AssetRequest.create({
      requestedBy: req.session.user.id,
      department: req.session.user.department,
      assetType,
      quantity: quantity || 1,
      reason
    });
    req.flash('success', 'Asset request submitted successfully!');
    res.redirect('/requests');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong');
    res.redirect('/requests/create');
  }
};

// ─── EMPLOYEE — View My Requests ───────────────────
exports.getMyRequests = async (req, res) => {
  try {
    const requests = await AssetRequest.findAll({
      where: { requestedBy: req.session.user.id },
      include: [
        { model: User, as: 'reviewer', attributes: ['name'] },
        { model: Asset, as: 'assignedAsset', attributes: ['name', 'serialNumber'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.render('requests/myRequests', { requests });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong');
    res.redirect('/dashboard');
  }
};

// ─── DEPT ADMIN — View Pending Requests ────────────
exports.getPendingRequests = async (req, res) => {
  try {
    const dept = req.session.user.department;

    const requests = await AssetRequest.findAll({
      where: { department: dept },
      include: [
        { model: User, as: 'requester', attributes: ['name', 'email'] },
        { model: User, as: 'reviewer', attributes: ['name'] },
        { model: Asset, as: 'assignedAsset', attributes: ['name', 'serialNumber'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Group by asset type for summary
    const summary = {};
    requests.forEach(r => {
      if (r.status === 'pending') {
        summary[r.assetType] = (summary[r.assetType] || 0) + r.quantity;
      }
    });

    // Available assets in this department for assigning
    const availableAssets = await Asset.findAll({
      where: { department: dept, status: 'available' }
    });

    res.render('requests/pending', { requests, summary, availableAssets, dept });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong');
    res.redirect('/dashboard');
  }
};

// ─── DEPT ADMIN — Approve / Reject / Assign ────────
exports.postUpdateRequest = async (req, res) => {
  try {
    const { action, assignedAssetId, reviewNote } = req.body;
    const request = await AssetRequest.findByPk(req.params.id);

    if (!request) {
      req.flash('error', 'Request not found');
      return res.redirect('/requests/pending');
    }

    if (action === 'approve') {
      await request.update({ status: 'approved', reviewedBy: req.session.user.id, reviewNote });
      req.flash('success', 'Request approved!');
    } else if (action === 'reject') {
      await request.update({ status: 'rejected', reviewedBy: req.session.user.id, reviewNote });
      req.flash('success', 'Request rejected!');
    } else if (action === 'assign') {
      if (!assignedAssetId) {
        req.flash('error', 'Please select an asset to assign');
        return res.redirect('/requests/pending');
      }

      // Update the asset
      const asset = await Asset.findByPk(assignedAssetId);
      await asset.update({
        assignedTo: request.requestedBy,
        status: 'assigned'
      });

      // Update the request
      await request.update({
        status: 'assigned',
        assignedAssetId,
        reviewedBy: req.session.user.id,
        reviewNote
      });

      req.flash('success', 'Asset assigned successfully!');
    }

    res.redirect('/requests/pending');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong');
    res.redirect('/requests/pending');
  }
};