const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const videoRoutes = require('./routes/videoRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(cors());

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => console.log("Connected to MongoDB")).catch((error) => console.error("Error connecting to MongoDB:", error));;

app.use(express.json());

app.use('/videos', videoRoutes);
app.use('/auth', authRoutes);

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});