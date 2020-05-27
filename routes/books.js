const express = require("express");
const router = express.Router();
const Book = require("../models").Book;

// Handler function to wrap each route
function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (error) {
      res.status(500).send(error);
      res.render("error");
    }
  };
}

// Get books listing
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const books = await Book.findAll({ order: [["createdAt", "DESC"]] });
    res.render("index", { books });
  })
);

// Create a new book form
router.get("/new", (req, res) => {
  res.render("new-book", { book: {}, title: "New Book" });
});

// POST create book
router.post(
  "/new",
  asyncHandler(async (req, res) => {
    const book = await Book.create(req.body);
    res.redirect("/books");
  })
);

// Shows book detail form
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      res.render("update-book", { book });
    } else {
      res.render("page-not-found");
    }
  })
);

// Updates book info into the database
router.post(
  "/:id",
  asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      await book.update(req.body);
      res.redirect("/books/" + book.id);
    } else {
      res.render("page-not-found");
    }
  })
);

// Deletes book
router.post(
  "/:id/delete",
  asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      await book.destroy();
      res.redirect("/books");
    } else {
      res.render("page-not-found");
    }
  })
);

module.exports = router;
