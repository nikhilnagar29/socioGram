const multer = require('multer');
const path = require('path');

// Configure storage to store images in memory as a Buffer
const storage = multer.memoryStorage();

// Filter to only allow image files
const fileFilter = (req, file, cb) => {
    const allowedFileTypes = /jpeg|jpg|png/;
    const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedFileTypes.test(file.mimetype);
    
    if (mimetype && extname) {
        cb(null, true);
    } else {
        cb(new Error('Only images are allowed'));
    }
};

// Create an instance of multer with the defined storage and file filter
const upload = multer({ 
    storage: storage, 
    limits: { fileSize: 1024 * 1024 * 1 }, // 1MB file size limit
    fileFilter: fileFilter 
});

module.exports = upload;
