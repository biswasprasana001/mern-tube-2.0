// backend\models\Playlist.js
const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
    name: { type: String, required: true },
    videos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video', unique: true }],
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Playlist', playlistSchema);