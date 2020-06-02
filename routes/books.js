const express = require("express");
const router = express.Router();
const Book = require("../models").Book;
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

// Handler function to wrap each route
function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (error) {
      res.status(500).send(error);
    }
  };
}

// Get books listing
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const books = await Book.findAll({
      // offset: 0,
      // limit: 10,
      order: [["createdAt", "DESC"]],
    });
    res.render("index", { books });
  })
);

// Search books
router.get(
  "/search",
  asyncHandler(async (req, res) => {
    let { term } = req.query;

    // Make lowercase
    term = term.toLowerCase();

    const books = await Book.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.like]: "%" + term + "%" } },
          { author: { [Op.like]: "%" + term + "%" } },
          { genre: { [Op.like]: "%" + term + "%" } },
          { year: { [Op.like]: "%" + term + "%" } },
        ],
      },
    });
    res.render("search-result", { books });
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
    let book;
    try {
      book = await Book.create(req.body);
      res.redirect("/books");
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        book = await Book.build(req.body);
        res.render("new-book", { book, errors: error.errors });
      } else {
        throw error;
      }
    }
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
      res.status(500);
      res.render("error");
    }
  })
);

// Updates book info into the database
router.post(
  "/:id",
  asyncHandler(async (req, res) => {
    let book;
    try {
      book = await Book.findByPk(req.params.id);
      if (book) {
        await book.update(req.body);
        res.redirect("/books");
      } else {
        res.render("error");
      }
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        book = await Book.build(req.body);
        book.id = req.params.id;
        res.render("update-book", { book, errors: error.errors });
      }
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
      res.render("error");
    }
  })
);

module.exports = router;
