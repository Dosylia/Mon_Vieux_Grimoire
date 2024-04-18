const express = require ('express');
const mongoose = require('mongoose');

const app = express();

const Book = require('./models/Book');
const User = require('./models/User');

mongoose.connect('mongodb+srv://user1:hQJKoAq9ABau0Hhm@cluster0.ic6uwmp.mongodb.net/?retryWrites=true&w=majority')
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });


  // POST ADDING USER/ HASHING PASSWORD
  app.post('/api/auth/signup', (req, res, next) => { 
      User.save()
      .then(() => res.status(201).json({message: 'Utilisateur crée'}))
      .catch(error => res.status(400).json({ error }));
  });


   // LOGIN USER
  app.post('/api/auth/login', (req, res, next) => {
    User.find()
      .then(() => res.status(201).json())
      .catch(error => res.status(400).json({ error }));
  });


   // GET Table of all books
  app.get('/api/books', (req, res, next) => {
      Book.find()
      .then(books => res.status(200).json(books))
      .catch(error => res.status(400).json({ error }));
  });


  // GET One book chosen with ID
  app.get('/api/books/:id', (req, res, next) => { 
    Book.find({ _id: req.params.id })
    .then(book => res.status(200).json(book))
    .catch(error => res.status(400).json({ error }));
});


// GET 3 books having best rating in database
app.get('/api/books/bestrating', (req, res, next) => { 
  Book.find()
      .sort({ averageRating: -1 })
      .limit(3)
      .then(books => res.status(200).json(books))
      .catch(error => res.status(400).json({ error }));
});


// POST ADD A BOOK TO DATABASE
app.post('/api/books', (req, res, next) => { 
  Book.save()
  .then(() => res.status(201).json({message: 'Livre ajouté'}))
  .catch(error => res.status(400).json({ error }));
});


// PUT UPDATE BOOK
app.put('/api/books/:id', (req, res, next) => { 
  Book.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({message: 'Livre mis à jour'}))
    .catch(error => res.status(400).json({ error }));
});


// DELETE BOOK
app.delete('/api/stuff/:id', (req, res, next) => {
  Book.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({message: 'Livre supprimé'}))
    .catch(error => res.status(400).json({ error }));
});


// ADD RATING TO A BOOK
app.post('/api/books/:id/rating', (req, res, next) => { 
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
});


module.exports = app;