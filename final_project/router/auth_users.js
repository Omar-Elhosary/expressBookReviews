const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  const user = users.filter((user) => user.username == username);
  return user.length == 0;
};

const authenticatedUser = (username, password) => {
  const user = users.filter(
    (user) => user.username == username && user.password == password
  );
  return user.length > 0;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!(username && password)) {
    return res
      .status(400)
      .json({ message: "Username or Password aren't valid" });
  }
  if (authenticatedUser(username, password)) {
    const token = jwt.sign({ username }, "fingerprint_customer", {
      expiresIn: "15s",
    });
    req.session.token = token;
    req.session.username = username;

    return res.send("Congrats, You logged in successfully!");
  }
  return res
    .status(403)
    .json({ message: "Username or Password aren't correct" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.username;
  const review = req.query.review;
  if (books[isbn]) {
    const book = books[isbn];
    book.reviews[username] = review;

    return res
      .status(201)
      .send({ message: "Your review has been added successfully!", review });
  }

  return res
    .status(400)
    .json({ message: "ISBN is invalid or The book isn't found" });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.username;
  if (books[isbn]) {
    const book = books[isbn];
    delete book.reviews[username];
    
    return res
      .status(201)
      .send({ message: "Your review has been deleted " });
  }

  return res
    .status(400)
    .json({ message: "ISBN is invalid or The book isn't found" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
