const express = require ('express');
const router = express.Router();

const userCtrl = require('../controllers/user');

// POST ADDING USER/ HASHING PASSWORD
router.post('/signup', userCtrl.createUser);


 // LOGIN USER
router.post('/login', userCtrl.createUser);

module.exports = router;