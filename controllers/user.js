const User = require('../models/User');

exports.signup = (req, res, next) => { 
    User.save()
    .then(() => res.status(201).json({message: 'Utilisateur crée'}))
    .catch(error => res.status(400).json({ error }));
};


exports.login = (req, res, next) => {
    User.find()
      .then(() => res.status(201).json())
      .catch(error => res.status(400).json({ error }));
  };