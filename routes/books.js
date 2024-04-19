const express = require ('express');
const auth = require('auth')
const router = express.Router();

const booksCtrl = require('../controllers/books');


router.get('/', auth, booksCtrl.showAllBooks);
router.get('/:id', auth, booksCtrl.showBookById);
router.get('/bestrating', auth, booksCtrl.showAllBooks);
router.post('/', auth, booksCtrl.addBook);
router.put('/:id', auth, booksCtrl.updateBook);
router.delete('/:id', auth, booksCtrl.deleteBook);
router.post('/:id/rating', auth, booksCtrl.addBookRating);


module.exports = router;
