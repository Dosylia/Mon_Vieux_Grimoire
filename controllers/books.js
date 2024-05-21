const mongoose = require('mongoose');
const fs = require('fs');
const Book = require('../models/Book');

exports.showAllBooks = (req, res, next) => {
    Book.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
};

exports.showBookById = (req, res, next) => { 
    Book.findOne({
        _id: req.params.id
      }).then(
        (book) => {
          res.status(200).json(book);
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
    Book.find()
        .sort({ averageRating: -1 })
        .limit(3)
        .then(books => res.status(200).json(books))
        .catch(error => res.status(400).json({ error }));
};

exports.addBook = (req, res, next) => { 
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject._userId;
    const book = new Book({
      ...bookObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
  
    book.save()
    .then(() => {res.status(201).json({message: 'Livre enregisté'})})
    .catch(error => {res.status(400).json({ error })})  
};

exports.updateBook = (req, res, next) => { 
    const bookObject = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  
    delete bookObject._userId;
    Book.findOne({_id: req.params.id})
        .then((book) => {
            if (book.userId != req.auth.userId) {
                res.status(401).json({ message : 'Not authorized'});
            } else {
                Book.updateOne({ _id: req.params.id}, { ...bookObject, _id: req.params.id})
                .then(() => res.status(200).json({message : 'Objet modifié!'}))
                .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};

exports.deleteBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id})
    .then(book => {
        if (book.userId != req.auth.userId) {
            res.status(401).json({message: 'Not authorized'});
        } else {
            const filename = book.imageUrl.split('/images/')[1];
            fs.unlinkSync(`images/${filename}`);
                Book.deleteOne({ _id: req.params.id })
                    .then(() => { res.status(200).json({message: 'Livre supprimé !'})})
                    .catch(error => res.status(401).json({ error }));
        }
    })
    .catch( error => {
        res.status(500).json({ error });
    });
};

exports.addBookRating = (req, res, next) => { 
    const updateRating = {
        userId: req.auth.userId,
        grade: req.body.rating
    };

    if (updateRating.grade < 0 || updateRating.grade > 5) {
        return res.status(400).json({ message: 'La note doit être entre 1 et 5' });
    }

    // Find book by it's ID
    Book.findOne({ _id: req.params.id})
        .then(book => {
            if (!book) {
                return res.status(404).json({ error: 'Livre non trouvé' });
            }
    
            // Add rating
            
            book.ratings.push(updateRating);
    
            // Calculate new rating
            let totalRating = 0;
            for (let rating of book.ratings) {
                totalRating += rating.grade;
            }
            book.averageRating = totalRating / book.ratings.length;
    
            // Save change
            return book.save();
        })
        .then((updateBook) => res.status(201).json(updateBook))
        .catch(error => res.status(400).json({ error }));
};


exports.showBooksByBestRating = (req, res, next) => { 
    Book.find()
        .sort({ averageRating: -1 })
        .limit(3)
        .then(books => res.status(200).json(books))
        .catch(error => res.status(400).json({ error }));
};