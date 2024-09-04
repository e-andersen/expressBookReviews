const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");

const regd_users = express.Router();

let users = [];

// Filter the users array for any user with the same username
const isRegistered = (username) => {
  return users.find(user => user.username === username) != undefined;
};

// Filter the users array for any user with the same username and password
const isAuthenticated = (username, password) => {
    return users.find(user => user.username === username && user.password === password) != undefined;
}

// Task 7: Users need to register before login.
regd_users.post('/login', (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if username and password exist.
  if (!username || !password) {
      return res.status(404).json({ message: 'Error logging in. Either username or password is missing.' });
  }

  // Is user authenticated
  if (isAuthenticated(username, password)) {
      // Generate JWT access token
      let accessToken = jwt.sign( { data: password }, 'access', { expiresIn: 60 * 60 });

      // Store access token and username in session
      req.session.authorization = { accessToken, username }
      return res.status(200).json({ message: 'User ' + username + ' successfully logged in.'});
  } else {
      return res.status(208).json({ message: 'Unable to login user ' + username + '. Make sure to register before login.' });
  }
});

// Task 8: Add or update a book review
regd_users.put('/auth/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;
  const book = Object.values(books).find(book => book.isbn === isbn);
  if (book) {
    const usr = req.session.authorization['username'];
    book.reviews[usr] = review;
    return res.status(200).json({ Title: book.title, Reviews: book.reviews });
  } else
    return res.status(200).json({ message: 'No book found for isbn ' + isbn });
});

// Task 9: delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const book = Object.values(books).find(book => book.isbn === isbn);
  if (book) {
    const usr = req.session.authorization['username'];
    delete book.reviews[usr];
    return res.status(200).json({ Title: book.title, Reviews: book.reviews });
  } else
    return res.status(200).json({ message: 'No book found for isbn ' + isbn });
});

module.exports.authenticated = regd_users;
module.exports.isRegistered = isRegistered;
module.exports.users = users;
