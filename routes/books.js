const express = require ('express');
const router = express.Router();

const booksCtrl = require('../controllers/books');


router.get('/', booksCtrl.showAllBooks);
router.get('/:id', booksCtrl.showBookById);
router.get('/bestrating', booksCtrl.showAllBooks);
router.post('/', booksCtrl.addBook);
router.put('/:id', booksCtrl.updateBook);
router.delete('/:id', booksCtrl.deleteBook);
router.post('/:id/rating', booksCtrl.addBookRating);


module.exports = router;
