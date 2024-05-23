// backend\models\Video.js
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  username: { type: String, required: true },
  comment: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const videoSchema = new mongoose.Schema({
  title: String,
  description: String,
  url: String,
  uploadDate: {
    type: Date,
    default: Date.now,
  },
  uploader: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [commentSchema],
  cloudinary_id: { type: String, required: true },
});

module.exports = mongoose.model('Video', videoSchema);