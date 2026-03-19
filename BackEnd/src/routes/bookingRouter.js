const express = require("express");
const bookingRouter = express.Router();

const Booking = require("../models/booking");
const Book = require("../models/book");
const { userAuth } = require("../middleware/adminAuth");


// ✅ CREATE BOOKING (MAIN API)
bookingRouter.post("/book/:bookId", userAuth, async (req, res) => {
    try {
        const user = req.user;
        const { bookId } = req.params;
        const { quantity } = req.body;

        // 1️⃣ Validate quantity
        if (!quantity || quantity <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid quantity",
            });
        }

        // 2️⃣ Find book
        const book = await Book.findById(bookId);

        if (!book) {
            return res.status(404).json({
                success: false,
                message: "Book not found",
            });
        }

        // 3️⃣ Check stock
        if (book.stock < quantity) {
            return res.status(400).json({
                success: false,
                message: "Not enough stock available",
            });
        }

        // 4️⃣ Calculate total price
        const totalPrice = book.price * quantity;

        // 5️⃣ Reduce stock
        book.stock -= quantity;
        await book.save();

        // 6️⃣ Create booking
        const booking = new Booking({
            userId: user._id,
            bookId: book._id,
            quantity,
            totalPrice,
        });

        const savedBooking = await booking.save();

        res.status(201).json({
            success: true,
            message: "Book booked successfully",
            booking: savedBooking,
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
});


// ✅ GET USER BOOKINGS
bookingRouter.get("/my-bookings", userAuth, async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.user._id })
            .populate("bookId", "title price imageUrl");

        res.status(200).json({
            success: true,
            bookings,
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
});


// ✅ CANCEL BOOKING
bookingRouter.patch("/booking/:id/cancel", userAuth, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found",
            });
        }

        // Only owner can cancel
        if (booking.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Not authorized",
            });
        }

        // Restore stock
        const book = await Book.findById(booking.bookId);
        book.stock += booking.quantity;
        await book.save();

        booking.status = "cancelled";
        await booking.save();

        res.status(200).json({
            success: true,
            message: "Booking cancelled",
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
});

module.exports = bookingRouter;