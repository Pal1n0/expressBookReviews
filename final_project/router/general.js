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
public_users.get('/', async function (req, res) {
    try {
      let list_of_books = await Promise.resolve(books);
      return res.status(300).send(JSON.stringify({ message: list_of_books }, null, 4));
    } catch (err) {
      return res.status(500).json({ error: "Error fetching books" });
    }
  });
  
  public_users.get('/isbn/:isbn', async function (req, res) {
    try {
      const isbn = req.params.isbn;
      const book = await Promise.resolve(books[isbn]);
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }
      return res.status(300).json({ message: book });
    } catch (err) {
      return res.status(500).json({ error: "Error fetching book by ISBN" });
    }
  });
  
  public_users.get('/author/:author', async function (req, res) {
    try {
      const author = req.params.author;
      const keys = Object.keys(books);
  
      const matchingBooks = await Promise.resolve(
        keys
          .map((id) => books[id])
          .filter((book) => book.author.toLowerCase() === author.toLowerCase())
      );
  
      return res.status(300).json(matchingBooks);
    } catch (err) {
      return res.status(500).json({ error: "Error fetching books by author" });
    }
  });
  
  public_users.get('/title/:title', async function (req, res) {
    try {
      const title = req.params.title;
      const keys = Object.keys(books);
  
      const matchingBooks = await Promise.resolve(
        keys
          .map((id) => books[id])
          .filter((book) => book.title.toLowerCase() === title.toLowerCase())
      );
  
      return res.status(300).json(matchingBooks);
    } catch (err) {
      return res.status(500).json({ error: "Error fetching books by title" });
    }
  });
  
  // Get book review
  public_users.get('/review/:isbn', async function (req, res) {
    try {
      let isbn = req.params.isbn;
      const review = await Promise.resolve(books[isbn]?.reviews);
  
      if (!review) {
        return res.status(404).json({ message: "No reviews found" });
      }
  
      return res.status(300).json(review);
    } catch (err) {
      return res.status(500).json({ error: "Error fetching review" });
    }
  });

module.exports.general = public_users;
