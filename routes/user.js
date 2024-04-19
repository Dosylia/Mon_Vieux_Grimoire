const express = require ('express');
const router = express.Router();

const User = require('../models/User');

// POST ADDING USER/ HASHING PASSWORD
router.post('/signup', (req, res, next) => { 
    User.save()
    .then(() => res.status(201).json({message: 'Utilisateur crée'}))
    .catch(error => res.status(400).json({ error }));
});


 // LOGIN USER
router.post('/login', (req, res, next) => {
  User.find()
    .then(() => res.status(201).json())
    .catch(error => res.status(400).json({ error }));
});

module.exports = router;