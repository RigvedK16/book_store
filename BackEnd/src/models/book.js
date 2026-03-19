const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        author: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            trim: true,
        },

        price: {
            type: Number,
            required: true,
            min: 0,
        },

        category: {
            type: String,
            required: true,
            enum: [
                "fiction",
                "non-fiction",
                "education",
                "technology",
                "self-help",
                "biography",
                "others",
            ],
        },

        stock: {
            type: Number,
            required: true,
            min: 0,
        },

        imageUrl: {
            type: String, // 🔗 S3 URL
            required: true,
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // admin who added book
        },

        reviewCount: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Book", bookSchema);