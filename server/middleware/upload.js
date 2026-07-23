import multer from 'multer';
import path from 'path';
import fs from 'fs';

const ALLOWED_FORMATS = ['jpg', 'jpeg', 'png', 'webp', 'svg'];

const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).slice(1).toLowerCase();
    if (!ALLOWED_FORMATS.includes(ext) && file.mimetype !== 'image/svg+xml')
      return cb(new Error('Only jpg, jpeg, png, webp, svg allowed'), false);
    cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

export default upload;
