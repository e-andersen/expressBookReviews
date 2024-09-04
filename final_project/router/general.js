const express = require('express');
let books = require("./booksdb.js");
let isRegistered = require("./auth_users.js").isRegistered;
let users = require("./auth_users.js").users;

const public_users = express.Router();


// Task 1: Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.status(200).json(books);
});

// Task 2: Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = Object.values(books).find(book => book.isbn === isbn);
  if (book)
    return res.status(200).json(book);
  else
    return res.status(200).json({ message: 'No book found for isbn ' + isbn });
 });

// Task 3: Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const re = new RegExp(author, 'i');
  const book = Object.values(books).filter(book => book.author.search(re) >= 0);
  if (book.length > 0)
    return res.status(200).json(book);
  else
    return res.status(200).json({ message: 'No books found for author ' + author });
});

// Task 4: Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const re = new RegExp(title, 'i');
  const book = Object.values(books).filter(book => book.title.search(re) >= 0);
  if (book.length > 0)
    return res.status(200).json(book);
  else
    return res.status(200).json({ message: 'No books found for title ' + title });
});

//  Task 5: Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = Object.values(books).find(book => book.isbn === isbn);
  if (book)
    return res.status(200).json({'Title': book.title, 'Review': book.reviews});
  else
    return res.status(200).json({ message: 'No review found for isbn ' + isbn });
});

// Task 6: Register new user
public_users.post('/register', (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isRegistered(username)) {
      users.push({ username: username, password: password });
      return res.status(200).json({ message: 'User ' + username + ' successfully registered. Now you can login.' });
    } else {
      return res.status(404).json({ message: 'User ' + username + ' already registered. Please login.' });
    }
  }
  return res.status(404).json({ message: 'Unable to register user. Either username or password is missing.' });
});

module.exports.general = public_users;

// Task 10: Get the book list available in the shop using Promise
public_users.get('/prom', function (req, res) {
  const prom = new Promise((resolve, reject) => {
    resolve(books);
  });
  prom.then(result => {
    res.json(result);
  });
});

// Task 11: Get book details based on ISBN using promise
public_users.get('/prom/isbn/:isbn', function (req, res) {
  const prom = new Promise((resolve, reject) => {
    const isbn = req.params.isbn;
    const book = Object.values(books).find(book => book.isbn === isbn);
    if (book)
      resolve(book);
    else
      resolve({ message: 'No book found for isbn ' + isbn });
  });
  prom.then(result => {
    res.json(result);
  });
 });

// Task 12: Get book details based on author using promise
public_users.get('/prom/author/:author', function (req, res) {
  const prom = new Promise((resolve, reject) => {
    const author = req.params.author;
    const re = new RegExp(author, 'i');
    const book = Object.values(books).filter(book => book.author.search(re) >= 0);
    if (book.length > 0)
      resolve(book);
    else
      resolve({ message: 'No books found for author ' + author });
  });
  prom.then(result => {
    res.json(result);
  });
});

// Task 13: Get all books based on title using promise
public_users.get('/prom/title/:title', function (req, res) {
  const prom = new Promise((resolve, reject) => {
    const title = req.params.title;
    const re = new RegExp(title, 'i');
    const book = Object.values(books).filter(book => book.title.search(re) >= 0);
    if (book.length > 0)
      resolve(book);
    else
      resolve({ message: 'No books found for title ' + title });
  });
  prom.then(result => {
    res.json(result);
  });
});
