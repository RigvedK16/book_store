const express = require("express");
const reviewRouter = express.Router();
const Review = require("../models/review");
const Book = require("../models/book");
const { userAuth } = require("../middleware/adminAuth");

// ✅ GET all reviews for a book
reviewRouter.get("/book/:bookId/reviews", userAuth, async (req, res) => {
    try {
        const { bookId } = req.params;
        const { page = 1, limit = 10 } = req.query;

        const reviews = await Review.find({ bookId })
            .populate("userId", "firstName lastName photoUrl")
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Review.countDocuments({ bookId });

        // Calculate average rating
        const avgRating = await Review.aggregate([
            { $match: { bookId: new mongoose.Types.ObjectId(bookId) } },
            { $group: { _id: null, avgRating: { $avg: "$rating" } } }
        ]);

        res.status(200).json({
            success: true,
            reviews,
            totalReviews: count,
            averageRating: avgRating[0]?.avgRating || 0,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
        });
    } catch (err) {
        console.error("Get reviews error:", err);
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
});

// ✅ CREATE a review (authenticated users only)
reviewRouter.post("/book/:bookId/review", userAuth, async (req, res) => {
    try {
        const { bookId } = req.params;
        const { rating, comment } = req.body;
        const userId = req.user._id;

        // Validate rating
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: "Rating must be between 1 and 5",
            });
        }

        // Check if user already reviewed this book
        const existingReview = await Review.findOne({ bookId, userId });
        if (existingReview) {
            return res.status(400).json({
                success: false,
                message: "You have already reviewed this book. Please update your existing review.",
            });
        }

        // Verify book exists
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({
                success: false,
                message: "Book not found",
            });
        }

        // Create review
        const review = new Review({
            userId,
            bookId,
            rating,
            comment: comment || "",
        });

        await review.save();

        // Update book's average rating
        await updateBookRating(bookId);

        // Populate user info for response
        await review.populate("userId", "firstName lastName photoUrl");

        res.status(201).json({
            success: true,
            message: "Review added successfully",
            review,
        });
    } catch (err) {
        console.error("Create review error:", err);
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
});

// ✅ UPDATE a review (only by review owner)
reviewRouter.patch("/review/:id", userAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const { rating, comment } = req.body;
        const userId = req.user._id;

        const review = await Review.findById(id);
        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Review not found",
            });
        }

        // Check ownership
        if (review.userId.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: "You can only update your own reviews",
            });
        }

        // Update fields
        if (rating) review.rating = rating;
        if (comment !== undefined) review.comment = comment;

        await review.save();

        // Update book's average rating
        await updateBookRating(review.bookId);

        await review.populate("userId", "firstName lastName photoUrl");

        res.status(200).json({
            success: true,
            message: "Review updated successfully",
            review,
        });
    } catch (err) {
        console.error("Update review error:", err);
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
});

// ✅ DELETE a review (only by review owner)
reviewRouter.delete("/review/:id", userAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const review = await Review.findById(id);
        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Review not found",
            });
        }

        // Check ownership
        if (review.userId.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: "You can only delete your own reviews",
            });
        }

        const bookId = review.bookId;
        await review.deleteOne();

        // Update book's average rating
        await updateBookRating(bookId);

        res.status(200).json({
            success: true,
            message: "Review deleted successfully",
        });
    } catch (err) {
        console.error("Delete review error:", err);
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
});

// ✅ HELPER: Update book's average rating
async function updateBookRating(bookId) {
    const result = await Review.aggregate([
        { $match: { bookId: new mongoose.Types.ObjectId(bookId) } },
        { $group: { _id: "$bookId", avgRating: { $avg: "$rating" }, count: { $sum: 1 } } }
    ]);

    const avgRating = result[0]?.avgRating || 0;
    const reviewCount = result[0]?.count || 0;

    await Book.findByIdAndUpdate(bookId, {
        rating: Math.round(avgRating * 10) / 10, // Round to 1 decimal
        reviewCount,
    });
}

// Import mongoose for ObjectId
const mongoose = require("mongoose");

module.exports = reviewRouter;