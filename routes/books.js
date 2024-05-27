const express = require ('express');
const { upload, optimize } = require('../middleware/multer-config')
const auth = require('../middleware/auth');

const router = express.Router();


const booksCtrl = require('../controllers/books');


router.get('/', booksCtrl.showAllBooks);
router.get('/bestrating', booksCtrl.showBooksByBestRating);
router.post('/', auth, upload, optimize, booksCtrl.addBook);
router.get('/:id', booksCtrl.showBookById);
router.put('/:id', auth, upload, optimize, booksCtrl.updateBook); // Put = Update
router.delete('/:id', auth, booksCtrl.deleteBook);
router.post('/:id/rating', auth, booksCtrl.addBookRating);


module.exports = router;
