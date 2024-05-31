const multer = require('multer');
const sharp = require('sharp');
path = require('path');
fs = require('fs');

//Set storage and name of picture
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        callback(null, name + Date.now() + '.webp');
    }
});

//Make sure pictures only are sent
const filter = (req, file, callback) => {
    if (file.mimetype.split("/")[0] === 'image') {
        callback(null, true);
    } else {
        callback(new Error("Les fichiers ne peuvent être que des images"));
    }
};

//Upload picture
const upload = multer({ storage: storage, fileFilter: filter }).single('image');


const optimize = (req, res, next) => {
    if (req.file) {
        const filePath = req.file.path;
        const output = path.join('images', `opt_${req.file.filename}`); // Name of optimized picture
        sharp(filePath)
            .resize({ width: null, height: 568, fit: 'inside', background: { r: 255, g: 255, b: 255, alpha: 0 } }) // Resize picture
            .webp() // Picture to webp
            .toFile(output) // Upload new picture 
            .then(() => {
                fs.unlink(filePath, (err) => { // Delete old picture
                    if (err) {   // <- Code not used, permission issue (Error: EPERM: operation not permitted)
                        console.log(err)
                        next();
                    }
                    req.file.path = output;
                    next();
                })
            })
            .catch(err => next(err));
    } else {
        return next();
    }
};



module.exports = {
    upload,
    optimize,
}