// const multer = require('multer');
// const path = require('path');

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, path.join(__dirname, '..', 'uploads'));
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

// const limits = { fileSize: 20000 }; // 20kb

// const fileFilter = (req, file, cb) => {
//   const allowedTypes = ['image/jpeg', 'image/png'];
//   if (allowedTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(new Error('Image must be in jpg or png format'), false);
//   }
// };

// const upload = multer({ storage, limits, fileFilter });

// module.exports = upload;
