const express = require ('express');
const mongoose = require('mongoose');
const mongoSanitize = require('express-mongo-sanitize');
const path = require('path');
require('dotenv').config();

const app = express();
const userRoutes = require('./routes/user');
const bookRoutes = require('./routes/books');

const dbUrl = process.env.DB_URL;

if (!dbUrl) {
  console.error('DB_URL n\'est pas défini dans .env');
  process.exit(1);
}

mongoose.connect(dbUrl)
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((err) => {
    console.error('Connexion à MongoDB échouée !', err);
});

app.use(express.json());

app.use(mongoSanitize({ // Replace dangerous char
  replaceWith: '_',
}));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

  app.use('/api/auth', userRoutes);
  app.use('/api/books', bookRoutes);
  app.use('/images', express.static(path.join(__dirname, 'images'))); // Make it possible to access the folder images with /images 


module.exports = app;