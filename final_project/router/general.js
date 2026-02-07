const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let users = require("./auth_users.js").users;

const public_users = express.Router();

// Register new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  const userExists = users.some(u => u.username === username);
  if (userExists) {
    return res.status(409).json({ message: "User already exists" });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "User registered successfully" });
});


// Task 1: Get all books (direct)
public_users.get('/books', (req, res) => {
  return res.status(200).json(Object.values(books));
});


// Task 10: Get all books using Axios async/await
public_users.get('/', async (req, res) => {
  try {
    const response = await axios.get("http://localhost:5000/books");
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books" });
  }
});


// Task 2: Get book by ISBN (direct)
public_users.get('/books/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) return res.status(200).json(book);
  return res.status(404).json({ message: "Book not found" });
});


// Task 11: Get book by ISBN using Axios async/await
public_users.get('/isbn/:isbn', async (req, res) => {
  try {
    const isbn = req.params.isbn;
    const response = await axios.get(`http://localhost:5000/books/isbn/${isbn}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(404).json({ message: "Book not found" });
  }
});


// Task 3: Get books by Author (direct)
public_users.get('/books/author/:author', (req, res) => {
  const author = req.params.author;

  const bookList = Object.values(books).filter(
    book => book.author.toLowerCase() === author.toLowerCase()
  );

  if (bookList.length > 0) return res.status(200).json(bookList);
  return res.status(404).json({ message: "No books found for the given author" });
});


// Task 12: Get books by Author using Axios async/await
public_users.get('/author/:author', async (req, res) => {
  try {
    const author = req.params.author;
    const response = await axios.get(`http://localhost:5000/books/author/${author}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(404).json({ message: "No books found for the given author" });
  }
});


// Task 4: Get books by Title (direct)
public_users.get('/books/title/:title', (req, res) => {
  const title = req.params.title;

  const bookList = Object.values(books).filter(
    book => book.title.toLowerCase() === title.toLowerCase()
  );

  if (bookList.length > 0) return res.status(200).json(bookList);
  return res.status(404).json({ message: "No books found for the given title" });
});


// Task 13: Get books by Title using Axios async/await
public_users.get('/title/:title', async (req, res) => {
  try {
    const title = req.params.title;
    const response = await axios.get(`http://localhost:5000/books/title/${title}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(404).json({ message: "No books found for the given title" });
  }
});


// Task 5: Get book reviews
public_users.get('/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) return res.status(200).json(book.reviews);
  return res.status(404).json({ message: "Book not found" });
});

module.exports.general = public_users;
