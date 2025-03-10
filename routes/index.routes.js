const express = require('express');
const { route } = require('./user.routes');

const router = express.Router();
const upload = require('../config/multer.cloudinary.config');
const fileModel = require('../models/files.models');
const authMiddleware = require('../middlewares/auth');
const cloudinary = require('../config/cloudinary.config');

router.get('/home', authMiddleware, async (req, res) => {
    try {
        const userFiles = await fileModel.find({
            user: req.user.userId   //find files uploaded by the user by userId
        });

        // console.log(userFiles);  //here we can see the files uploaded by the user as array of objects
        res.render('home', {
            files: userFiles   //reading userFiles from backend and showing on frontend using files variable in home.ejs
        });
    } catch (error) {
        console.error('Error fetching user files:', error);
        res.status(500).json({ error: 'Error fetching user files' });
    }
});

router.post('/upload', authMiddleware, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'File upload failed' });
        }

        // Perform file operations here (e.g., save to disk, process contents)
        console.log('File received:', req.file.originalname);

        const newFile = await fileModel.create({
            path: req.file.path,
            originalname: req.file.originalname,
            user: req.user.userId
        });

        res.status(200).json(newFile);
    } catch (error) {
        console.error('Error processing file:', error);
        res.status(500).json({ error: 'Error processing file' });
    }
});

//router for downloading the file
router.get('/download/:path', authMiddleware, async (req, res) => {
    try {
        const loggedUserId = req.user.userId;
        const path = req.params.path;
        
        console.log(path);

        const file = await fileModel.findOne({
            user: loggedUserId,
            path: path
        });

        if (!file) {
            return res.status(404).json({ error: 'Unauthorized' });
        }

        // Generate a signed URL for the file from Cloudinary
        const signedUrl = cloudinary.url(path, {
            secure: true,
            sign_url: true,
            type: 'private',
            resource_type: 'raw'
        });

        res.redirect(signedUrl);
    } catch (error) {
        console.error('Error downloading file:', error);
        res.status(500).json({ error: 'Error downloading file' });
    }
});

module.exports = router;