// backend\uploadMiddleware.js
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: 'du4xenop9',
  api_key: '158578283622496',
  api_secret: '0ZNvz7JVRBQnD5KemTaEZO4Vb4Y'
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'video-sharing-platform',
    resource_type: 'video',
    // public_id: (req, file) => file.originalname, // You can uncomment this line if you want to set a custom public ID based on the original file name
  },
});

const parser = multer({ storage: storage });

module.exports = {parser, cloudinary};