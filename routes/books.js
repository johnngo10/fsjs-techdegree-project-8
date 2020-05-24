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
    }
  };
}

// Get books listing
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const books = await Book.findAll({ order: [["createdAt", "DESC"]] });
    res.render("");
  })
);

// Create a new book form
router.get("/new", (req, res) => {
  res.render("books/new", { book: {}, title: "New Book" });
});

// POST create book
router.post("/new");

// Shows book detail form
router.get("/:id");

// Updates book info into the database
router.post("/:id");

// Deletes book
router.post(":/id/delete");
