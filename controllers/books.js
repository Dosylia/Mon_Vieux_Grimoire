const Book = require('../models/Book');

exports.showAllBooks = (req, res, next) => {
    Book.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
};

exports.showBookById = (req, res, next) => { 
    Book.find({ _id: req.params.id })
    .then(book => res.status(200).json(book))
    .catch(error => res.status(400).json({ error }));
};

exports.showBooksByBestRating = (req, res, next) => { 
    Book.find()
        .sort({ averageRating: -1 })
        .limit(3)
        .then(books => res.status(200).json(books))
        .catch(error => res.status(400).json({ error }));
};

exports.addBook = (req, res, next) => { 
    delete req.body._id;
    const book = new Book({
      ...req.body
    });
    
    book.save()
      .then(() => res.status(201).json({ message: 'Livre ajouté' }))
      .catch(error => res.status(400).json({ error }));
};

exports.updateBook = (req, res, next) => { 
    Book.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
      .then(() => res.status(200).json({message: 'Livre mis à jour'}))
      .catch(error => res.status(400).json({ error }));
};

exports.deleteBook = (req, res, next) => {
    Book.deleteOne({ _id: req.params.id })
      .then(() => res.status(200).json({message: 'Livre supprimé'}))
      .catch(error => res.status(400).json({ error }));
};

exports.addBookRating = (req, res, next) => { 
    const bookId = req.params.id;
    const { userId, grade } = req.body;
    
    // Check ID of book
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
        return res.status(400).json({ error: 'Invalid book ID' });
    }
    
    // Find book by it's ID
    Book.findById(bookId)
        .then(book => {
            if (!book) {
                return res.status(404).json({ error: 'Book not found' });
            }
    
            // Add rating
            book.ratings.push({ userId, grade });
    
            // Calculate new rating
            let totalRating = 0;
            for (let rating of book.ratings) {
                totalRating += rating.grade;
            }
            book.averageRating = totalRating / book.ratings.length;
    
            // Save change
            return book.save();
        })
        .then(() => res.status(201).json({ message: 'Rating added successfully' }))
        .catch(error => res.status(400).json({ error }));
};