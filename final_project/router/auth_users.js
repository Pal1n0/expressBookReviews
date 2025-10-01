const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    return users.some(user => user.username === username)
}

const authenticatedUser = (username,password)=>{ //returns boolean
    return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (!isValid(username)) {
    return res.status(401).json({ message: "User not registered" });
  }
  
  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  const accessToken = jwt.sign(
    { username },           // payload
    "access",               // secret key
    { expiresIn: 60 * 60 }  // 1 hour expiry
  );

  req.session.authorization = {
    accessToken,
    username
  };
  return res.status(300).json({message: "User successfully logged in"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;
    const reviewText = req.body.review;
    const book = books[isbn];

    if (!reviewText) {
        return res.status(400).json({ message: "Review text is required" });
      }

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  
  book.reviews[username] = reviewText;


  return res.status(300).json({message: `Review for book '${book.title}' by user '${username}' has been added/updated.`,
    reviews: book.reviews});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
