// const multer = require("multer");
// const multerS3 = require("multer-s3");
// const s3 = require("../utils/s3");

// const upload = multer({
//     storage: multerS3({
//         s3: s3,
//         bucket: process.env.S3_BUCKET_NAME,
//         acl: "public-read",
//         key: function (req, file, cb) {
//             cb(null, `books/${Date.now()}-${file.originalname}`);
//         },
//     }),
// });

// module.exports = upload;

const multer = require("multer");
const multerS3 = require("multer-s3");
const s3 = require("../utils/s3");

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.S3_BUCKET_NAME,
        key: function (req, file, cb) {
            // Sanitize filename to avoid S3 issues
            const sanitizedName = file.originalname
                .replace(/[^a-zA-Z0-9.-]/g, '_')
                .toLowerCase();
            cb(null, `books/${Date.now()}-${sanitizedName}`);
        },
        contentType: multerS3.AUTO_CONTENT_TYPE, // ✅ Auto-detect content type
    }),
    // Optional: File validation
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Only image files are allowed!"), false);
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
});

module.exports = upload;