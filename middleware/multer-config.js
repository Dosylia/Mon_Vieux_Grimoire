const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs').promises;
const os = require('os');
const path = require('path');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp'
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    const timestamp = Date.now();
    callback(null, `${name}_${timestamp}.${extension}`);
  }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, callback) => {
        if (MIME_TYPES[file.mimetype]) {
            callback(null, true)
        } else {
            callback(new Error('Type de fichier invalide !'))
        }
    },
}).single('image')

const optimize = async (req, res, next) => {
    if (!req.file) {
        return next();
    }

    const filePath = req.file.path;
    const tempFilePath = path.join(os.tmpdir(), `${Date.now()}_optimized`);
  

    try {
        await sharp(filePath)
            .resize({ width: 160, height: 260 })
            .toBuffer()
            .then(async (data) => {
                await fs.writeFile(tempFilePath, data);
            });

        // Renommer tempFilePath pour écraser l'original
        await fs.rename(tempFilePath, filePath);

        next();
    } catch (error) {
        next(error);
    }
};

module.exports = {
    upload,
    optimize,
}