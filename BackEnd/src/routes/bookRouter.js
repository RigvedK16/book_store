const express = require("express");
const bookRouter = express.Router();
const Book = require("../models/book");
const { userAuth } = require("../middleware/adminAuth");
const adminAuth = require("../middleware/adminMiddleware");


// ✅ CREATE BOOK (Admin)
bookRouter.post("/book", userAuth, adminAuth, async (req, res) => {
    try {
        const user = req.user;

        const {
            title,
            author,
            description,
            price,
            category,
            stock,
            imageUrl,
        } = req.body;

        const book = new Book({
            title,
            author,
            description,
            price,
            category,
            stock,
            imageUrl,
            createdBy: user._id,
        });

        const savedBook = await book.save();

        res.status(201).json({
            success: true,
            message: "Book created successfully",
            book: savedBook,
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
});


// ✅ GET ALL BOOKS
bookRouter.get("/books", async (req, res) => {
    try {
        const books = await Book.find().populate("createdBy", "firstName emailId");

        res.status(200).json({
            success: true,
            books,
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
});


// ✅ GET SINGLE BOOK
bookRouter.get("/book/:id", async (req, res) => {
    try {
        const bookId = req.params.id;

        const book = await Book.findById(bookId);

        if (!book) {
            return res.status(404).json({
                success: false,
                message: "Book not found",
            });
        }

        res.status(200).json({
            success: true,
            book,
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
});


// ✅ UPDATE BOOK
bookRouter.patch("/book/:id", userAuth, adminAuth, async (req, res) => {
    try {
        const bookId = req.params.id;

        const updatedBook = await Book.findByIdAndUpdate(
            bookId,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedBook) {
            return res.status(404).json({
                success: false,
                message: "Book not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Book updated",
            book: updatedBook,
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
});


// ✅ DELETE BOOK
bookRouter.delete("/book/:id", userAuth, adminAuth, async (req, res) => {
    try {
        const bookId = req.params.id;

        const deletedBook = await Book.findByIdAndDelete(bookId);

        if (!deletedBook) {
            return res.status(404).json({
                success: false,
                message: "Book not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Book deleted successfully",
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
});


// ✅ SEARCH BOOKS (IMPORTANT FEATURE)
bookRouter.get("/books/search", async (req, res) => {
    try {
        const { query } = req.query;

        const books = await Book.find({
            $or: [
                { title: { $regex: query, $options: "i" } },
                { author: { $regex: query, $options: "i" } },
            ],
        });

        res.status(200).json({
            success: true,
            books,
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
});

module.exports = bookRouter;