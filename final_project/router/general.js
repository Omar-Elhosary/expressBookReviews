const axios = require("axios");
const express = require("express");
let books = require("./booksdb.js");
const session = require("express-session");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!(username && password)) {
    return res
      .status(400)
      .json({ message: "Username or Password aren't valid" });
  }

  if (!isValid(username)) {
    return res
      .status(409)
      .json({ message: username + "is already existed. Login instead" });
  }

  users.push({
    username,
    password,
  });

  return res.send(username + " has been created successfully!!");
});

// Get the book list available in the shop
public_users.get("/", async (req, res) => {
  try {
    return res.status(200).json(books);
  } catch {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async (req, res) => {
  try {
    const isbn = req.params.isbn;
    if (books[isbn]) {
      return res.status(200).json(books[isbn]);
    }
  } catch {
    return res
      .status(400)
      .json({ message: "ISBN is invalid or The book isn't found" });
  }
});

// Get book details based on author
public_users.get("/author/:author", async (req, res) => {
  try {
    const author = req.params.author;
    const authorBooks = Object.values(books).filter(
      (book) => book.author == author
    );

    if (authorBooks.length > 0) {
      return res.status(200).json(authorBooks);
    }
  } catch {
    return res
      .status(400)
      .json({ message: "No books're found for this author" });
  }
});

// Get all books based on title
public_users.get("/title/:title", async (req, res) => {
  try {
    const title = req.params.title;
    const book = Object.values(books).filter((book) => book.title == title);
    console.log(book);

    if (book.length > 0) {
      return res.status(200).json(book[0]);
    }
  } catch {
    return res.status(400).json({ message: "This book isn't found" });
  }
});

//  Get book review
public_users.get("/review/:isbn", async (req, res) => {
  try {
    const isbn = req.params.isbn;
    if (books[isbn]) {
      return res.status(200).json(books[isbn].reviews);
    }
  } catch {
    return res
      .status(400)
      .json({ message: "ISBN is invalid or The book isn't found" });
  }
});

module.exports.general = public_users;
