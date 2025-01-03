require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const eventRoutes = require('./routes/eventRoutes');

const app = express();

app.use(express.json());
app.use('/api/events', eventRoutes);

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

module.exports = app;