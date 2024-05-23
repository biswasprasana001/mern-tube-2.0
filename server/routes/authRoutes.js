// backend\routes\authRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user || !(await user.comparePassword(req.body.password))) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }
    const token = jwt.sign({ userId: user._id }, 'YOUR_SECRET_KEY', { expiresIn: '1h' });
    res.json({ token, userId: user._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;