const fs = require('fs');
const Book = require('../models/Book');

exports.showAllBooks = (req, res, next) => {
    Book.find() // Show and return all books
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
};

exports.showBookById = (req, res, next) => { 
    Book.findOne({ // Find only one book using ID
        _id: req.params.id
      }).then(
        (book) => {
          res.status(200).json(book); // Return the book if success
        }
      ).catch(
        (error) => {
          res.status(404).json({
            error: error
          });
        }
      );
};

exports.showBooksByBestRating = (req, res, next) => { 
    Book.find() // Find all book
        .sort({ averageRating: -1 }) // Sorted in descending order (from highest to lowest)
        .limit(3) // Only take the 3 first books 
        .then(books => res.status(200).json(books)) // Return the books
        .catch(error => res.status(400).json({ error }));
};

exports.addBook = (req, res, next) => { 
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id; // Deleting those parameters to make sure right one are being used.
    delete bookObject._userId;
    const book = new Book({
      ...bookObject, // ... syntax to copy ll properties easely except the two userId that got deleted above for safety purpose.
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/opt_${req.file.filename}` // Sending picture link to database 
    });
  
    book.save() // Saving the book
    .then(() => {res.status(201).json({message: 'Livre enregisté'})}) // Returning a success message
    .catch(error => {res.status(400).json({ error })})  
};

exports.updateBook = (req, res, next) => { 
    const bookObject = req.file ? { // what will be updated on book, ... syntax again and link for picture
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/opt_${req.file.filename}`
    } : { ...req.body };
  
    delete bookObject._userId;
    Book.findOne({_id: req.params.id}) // Find the book that must be updated
        .then((book) => {
            if (book.userId != req.auth.userId) { // Make sure the right user is trying to update it
                res.status(401).json({ message : 'Not authorized'});
            } else {
                Book.updateOne({ _id: req.params.id}, { ...bookObject, _id: req.params.id}) // Updating book with updateOne
                .then(() => {
                    res.status(200).json({ message: 'book successfully updated' }); // return message of success
                    const pictureToReplace = book.imageUrl.split('/images')[1]; 
                    req.file && fs.unlink(`images/${pictureToReplace}`, (err => { // delete old picture
                        if (err) console.log(err);
                    }))
                })
                .catch(error => res.status(401).json({ error }));
        }
    })
    .catch(error => res.status(400).json({ error }));

};

exports.deleteBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id}) // Find the book we want to delete
    .then(book => {
        if (book.userId != req.auth.userId) { // Make sure the right user wants to delete it
            res.status(401).json({message: 'Not authorized'});
        } else {
            const filename = book.imageUrl.split('/images/')[1];
            fs.unlinkSync(`images/${filename}`); // Delete the picture
                Book.deleteOne({ _id: req.params.id }) // Dlete the book using deleteOne
                    .then(() => { res.status(200).json({message: 'Livre supprimé !'})})
                    .catch(error => res.status(401).json({ error }));
        }
    })
    .catch( error => {
        res.status(500).json({ error });
    });
};

exports.addBookRating = (req, res, next) => { 
    const updateRating = { // what will be updated
        userId: req.auth.userId,
        grade: req.body.rating
    };

    if (updateRating.grade < 0 || updateRating.grade > 5) { // Making sure we got data fitting for database
        return res.status(400).json({ message: 'La note doit être entre 1 et 5' });
    }

    
    Book.findOne({ _id: req.params.id}) // Find book by it's ID
        .then(book => {
            if (!book) {
                return res.status(404).json({ error: 'Livre non trouvé' });
            }
    
            book.ratings.push(updateRating); // Add rating pushing it into the table
    
            // Calculate new rating
            let totalRating = 0;
            for (let rating of book.ratings) { // Calculate new rating using loop for of
                totalRating += rating.grade;
            }
            book.averageRating = totalRating / book.ratings.length;
    
            return book.save(); // Save change
        })
        .then((updateBook) => res.status(201).json(updateBook)) 
        .catch(error => res.status(400).json({ error }));
};