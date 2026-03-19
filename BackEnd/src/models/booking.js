const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        bookId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Book",
            required: true,
        },

        quantity: {
            type: Number,
            required: true,
            min: 1,
        },

        totalPrice: {
            type: Number,
            required: true,
        },

        status: {
            type: String,
            enum: ["booked", "cancelled", "delivered"],
            default: "booked",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema); 