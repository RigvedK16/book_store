const express = require("express");
const uploadRouter = express.Router();
const upload = require("../middleware/upload");
const { userAuth } = require("../middleware/adminAuth");

// upload single image
uploadRouter.post("/upload", userAuth, upload.single("image"), (req, res) => {
    try {
        res.status(200).json({
            success: true,
            imageUrl: req.file.location, // 🔥 S3 URL
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
});

module.exports = uploadRouter;