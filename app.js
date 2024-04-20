const express = require ('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const userRoutes = require('./routes/user');
const bookRoutes = require('./routes/books');

mongoose.connect('mongodb+srv://user1:hQJKoAq9ABau0Hhm@cluster0.ic6uwmp.mongodb.net/?retryWrites=true&w=majority')
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

  app.use('/api/auth', userRoutes);
  app.use('/api/books', bookRoutes);
  app.use('/images', express.static(path.join(__dirname, 'images')));


module.exports = app;