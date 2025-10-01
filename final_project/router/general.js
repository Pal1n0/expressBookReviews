const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const {username, password} = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
    
      // 2. Check if user already exists
      const userExists = users.some(user => user.username === username);
      if (userExists) {
        return res.status(409).json({ message: "Username already exists" });
      }
    
      // 3. Add new user
      users.push({ username, password });  // In practice, hash the password!
      
      return res.status(201).json({ message: "User registered successfully" });
    });

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  let list_of_books = books
  return res.status(300).send(JSON.stringify({ message: list_of_books }, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
    return res.status(300).json({message: book});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const matchingBooks = [];
  const keys = Object.keys(books)

  keys.forEach((id) => {
    if (books[id].author.toLowerCase() === author.toLowerCase()) {
        matchingBooks.push({ ...books[id]})
    }
  });
  return res.status(300).json(matchingBooks);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    const matchingBooks = [];
    const keys = Object.keys(books)
  
    keys.forEach((id) => {
      if (books[id].title.toLowerCase() === title.toLowerCase()) {
          matchingBooks.push({ ...books[id]})
      }
    });
    return res.status(300).json(matchingBooks);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  let review = books[isbn].reviews

  return res.status(300).json(review);
});

module.exports.general = public_users;
