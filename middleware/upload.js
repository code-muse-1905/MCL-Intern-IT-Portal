const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ── Create uploads folder if it doesn't exist ──
const uploadDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ── Storage config ──────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  }
});

// ── File filter (images + docs only) ───────────
const fileFilter = (req, file, cb) => {
  const allowed = [
    '.jpg', '.jpeg', '.png', '.gif',        // images
    '.pdf', '.doc', '.docx', '.txt', '.xlsx' // documents
  ];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only images and documents are allowed!'), false);
  }
};

// ── Upload limits ───────────────────────────────
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB max
});

// ── Export different upload types ───────────────
module.exports = {
  // For ticket: accepts both image and doc
  ticketUpload: upload.fields([
    { name: 'imageUrl', maxCount: 1 },
    { name: 'docUrl', maxCount: 1 }
  ]),

  // Single image upload (for profile etc)
  singleImage: upload.single('image'),

  // Single doc upload
  singleDoc: upload.single('doc')
};