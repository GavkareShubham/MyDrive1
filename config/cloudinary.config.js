require('dotenv').config(); // Add this line to load environment variables

const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'dcipszdwn',
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

module.exports = cloudinary;