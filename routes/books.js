const express = require ('express');
const multer = require('../middleware/multer-config')
const auth = require('../middleware/auth');

const router = express.Router();


const booksCtrl = require('../controllers/books');


router.get('/', booksCtrl.showAllBooks);
router.get('/bestrating', booksCtrl.showBooksByBestRating);
router.post('/', auth, multer, booksCtrl.addBook);
router.get('/:id', booksCtrl.showBookById);
router.put('/:id', auth, multer, booksCtrl.updateBook);
router.delete('/:id', auth, booksCtrl.deleteBook);
router.post('/:id/rating', auth, multer, booksCtrl.addBookRating);


module.exports = router;
