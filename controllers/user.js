const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '../.env' });

const User = require('../models/User');

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10) // using bcrypt to hash password, 10 is how strong hash will be
      .then(hash => {
        const user = new User({
          email: req.body.email,
          password: hash
        });
        user.save() // saving user
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };

  exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email }) // Find user 
        .then(user => {
            if (!user) { // if user not found, return message saying so, we do not say if it's email or password that is wrong for safety 
                return res.status(401).json({ message: 'Paire login/mot de passe incorrecte'});
            }
            bcrypt.compare(req.body.password, user.password) // if user found, we compared password with hashed one
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' }); // if password does not work return an error, we do not say if it's email or password that is wrong for safety
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign( // give token to user using jwt to add, delete or update book. But also to add rating.
                            { userId: user._id}, // personalized token for each user
                            process.env.JWT_SECRET, // Secret key in .env to make sure token hasn't been modified
                            { expiresIn: '24h' } 
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
 };