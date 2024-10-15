const express = require("express");
let books = require("./booksdb.js");
const session = require("express-session");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
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
public_users.get("/", function (req, res) {
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  }
  return res
    .status(400)
    .json({ message: "ISBN is invalid or The book isn't found" });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  const authorBooks = Object.values(books).filter(
    (book) => book.author == author
  );
  console.log(authorBooks);

  if (authorBooks.length > 0) {
    return res.status(200).json(authorBooks);
  }
  return res.status(400).json({ message: "No books're found for this author" });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;
  const book = Object.values(books).filter((book) => book.title == title);
  console.log(book);

  if (book.length > 0) {
    return res.status(200).json(book[0]);
  }
  return res.status(400).json({ message: "This book isn't found" });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  }
  return res
    .status(400)
    .json({ message: "ISBN is invalid or The book isn't found" });
});

module.exports.general = public_users;
