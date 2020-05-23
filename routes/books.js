const express = require("express");
const router = express.Router();
const Book = require("../models").Book;

// Get books listing
router.get("/");

// Create a new book form
router.get("/new");

// POST create book
router.post("/new");

// Shows book detail form
router.get("/:id");

// Updates book info into the database
router.post("/:id");

// Deletes book
router.post(":/id/delete");
