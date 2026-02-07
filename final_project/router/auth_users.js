const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Check if username is valid
const isValid = (username) => {
  return !users.some(user => user.username === username);
};

// Authenticate user (username & password match)
const authenticatedUser = (username, password) => {
  return users.some(user => user.username === username && user.password === password);
};

// only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }
  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid login. Check username and password" });
  }
  // Generate JWT token
  let accessToken = jwt.sign(
    { data: username },
    "access",
    { expiresIn: 60 * 60 }
  );
  // Save token in session
  req.session.authorization = { accessToken };
  return res.status(200).json({ message: "User successfully logged in" });
});

regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.user; 

  if (!review) {
    return res.status(400).json({ message: "Review is required" });
  }
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }
  // If reviews object doesn't exist, create it
  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }
  // Add or update review
  books[isbn].reviews[username] = review;

  return res.status(200).json({
    message: "Review added/updated successfully",
    reviews: books[isbn].reviews
  });
});


regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user; 

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (!books[isbn].reviews || !books[isbn].reviews[username]) {
    return res.status(404).json({ message: "Review not found for this user" });
  }

  // Delete only this user's review
  delete books[isbn].reviews[username];
  return res.status(200).json({
    message: `Review for ISBN ${isbn} deleted successfully`,
    reviews: books[isbn].reviews
  });
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
