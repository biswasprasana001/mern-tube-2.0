// backend\routes\videoRoutes.js
const express = require('express');
const router = express.Router();
const Video = require('../models/Video');
const Playlist = require('../models/Playlist');
const { parser, cloudinary } = require('../uploadMiddleware');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, async (req, res) => {
    try {
        const videos = await Video.find().populate('uploader', 'username');
        res.json(videos);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', authMiddleware, parser.single('video'), async (req, res) => {
    console.log(req.file);
    try {
        const video = new Video({
            title: req.body.title,
            description: req.body.description,
            url: req.file.path,
            uploader: req.userData.userId,
            cloudinary_id: req.file.filename,
        });

        const newVideo = await video.save();
        res.status(201).json(newVideo);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);
        if (video.uploader.toString() !== req.userData.userId) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        // Remove video from Cloudinary
        // You can use the public ID stored in your database instead of extracting it from the URL
        try {
            // Await for the destroy operation to complete
            const result = await cloudinary.uploader.destroy(video.cloudinary_id, { resource_type: 'video' });
            // Check if the destroy was successful
            if (result && result.result === 'ok') {
                // The video was destroyed successfully
                await Video.findByIdAndDelete(req.params.id);
                res.json({ message: 'Video deleted' });
                console.log('The video was destroyed successfully');
            } else {
                // There was an error destroying the video
                console.error('There was an error destroying the video:', result);
            }
        } catch (error) {
            // Handle any unexpected errors
            console.error('There was an unexpected error:', error);
        }

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/user/:userId', authMiddleware, async (req, res) => {
    try {
        const videos = await Video.find({ uploader: req.params.userId }).populate('uploader', 'username');
        res.json(videos);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/:id/like', authMiddleware, async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);
        const index = video.likes.indexOf(req.userData.userId);
        if (index === -1) {
            video.likes.push(req.userData.userId);
        } else {
            video.likes.splice(index, 1);
        }
        await video.save();
        res.json({ likes: video.likes });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/my-likes/:userId', authMiddleware, async (req, res) => {
    try {
        const videos = await Video.find({ likes: { $in: [req.params.userId] } }).populate('uploader', 'username');
        res.json(videos);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/:id/comment', authMiddleware, async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);
        video.comments.push({ userId: req.userData.userId, username: req.body.username, comment: req.body.comment });
        await video.save();
        res.json({ message: 'Comment added' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// route to create a new playlist
router.post('/playlist', authMiddleware, async (req, res) => {
    try {
        const playlist = new Playlist({
            name: req.body.name,
            videos: [req.body.videoId],
            userId: req.body.userId
        });
        const newPlaylist = await playlist.save();
        res.status(201).json(newPlaylist);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// route to get all playlists
router.get('/playlists', authMiddleware, async (req, res) => {
    try {
        const playlists = await Playlist.find({ userId: req.userData.userId });
        res.json(playlists);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// route to get detail about a playlist
router.get('/playlist/:id', authMiddleware, async (req, res) => {
    try {
        const playlist = await Playlist.findById(req.params.id);
        res.json(playlist);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// route to add a video to a playlist
router.put('/playlist/:id', authMiddleware, async (req, res) => {
    try {
        const playlist = await Playlist.findById(req.params.id);
        if (playlist.userId.toString() !== req.body.userId) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        playlist.videos.push(req.body.videoId);
        await playlist.save();
        res.json({ message: 'Video added to playlist' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// route to delete a playlist
router.delete('/playlist/:id', authMiddleware, async (req, res) => {
    try {
        const playlist = await Playlist.findById(req.params.id);
        if (playlist.userId.toString() !== req.userData.userId) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        await Playlist.findByIdAndDelete(req.params.id);
        res.json({ message: 'Playlist deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// route to get all videos in a playlist
router.get('/playlist/:id/videos', authMiddleware, async (req, res) => {
    try {
        const playlist = await Playlist.findById(req.params.id).populate({
            path: 'videos',
            populate: { path: 'uploader' }
        });;
        if (playlist.userId.toString() !== req.userData.userId) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        res.json(playlist.videos);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// route to delete a video from a playlist
router.delete('/playlist/:id/video/:videoId', authMiddleware, async (req, res) => {
    try {
        const playlist = await Playlist.findById(req.params.id);
        if (playlist.userId.toString() !== req.userData.userId) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        playlist.videos = playlist.videos.filter(videoId => videoId.toString() !== req.params.videoId);
        await playlist.save();
        res.json({ message: 'Video removed from playlist' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;