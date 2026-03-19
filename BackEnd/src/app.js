// const express = require("express");
// const jwt = require("jsonwebtoken");
// const authRouter = express.Router();
// const User = require("../models/user");
// const bcrypt = require("bcrypt");
// const { validateSignUpData } = require("../utils/validation");

// authRouter.post("/signup", async (req, res) => {
//   try {
//     validateSignUpData(req);

//     const {
//       firstName,
//       lastName,
//       emailId,
//       password,
//       gender,
//       age,
//       photoUrl,
//       about,
//       location,
//     } = req.body;

//     const passwordHash = await bcrypt.hash(password, 10);

//     const user = new User({
//       firstName,
//       lastName,
//       emailId,
//       password: passwordHash,
//       gender,
//       age,
//       role: "user",
//       photoUrl,
//       about,
//       location,
//     });

//     const savedUser = await user.save();
//     savedUser.password = undefined;

//     res.status(201).json({
//       message: "User registered successfully",
//       user: savedUser,
//     });
//   } catch (err) {
//     res.status(400).json({
//       message: "Error adding user",
//       error: err.message,
//     });
//   }
// });

// authRouter.post("/login", async (req, res) => {
//   try {
//     const { emailId, password } = req.body;

//     if (!emailId || !password) {
//       return res.status(400).json({
//         success: false,
//         message: "Email and password are required",
//       });
//     }

//     const user = await User.findOne({ emailId });
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "EMAIL NOT FOUND",
//       });
//     }

//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       return res.status(401).json({
//         success: false,
//         message: "INCORRECT PASSWORD",
//       });
//     }

//     const token = jwt.sign(
//       { _id: user._id, role: user.role },
//       process.env.JWT_SECRET
//     );

//     user.password = undefined;

//     return res.status(200).json({
//       success: true,
//       message: "LOGIN SUCCESS",
//       user: user,
//       token, // 🔥 IMPORTANT
//     });
//   } catch (err) {
//     return res.status(500).json({
//       success: false,
//       message: "Something went wrong. Please try again.",
//     });
//   }
// });

// authRouter.get("/profile", require("../middleware/adminAuth").userAuth, async (req, res) => {
//   res.send(req.user);
// });

// authRouter.post("/logout", async (req, res) => {
//   res.send("Logout success"); // no cookie needed
// });

// module.exports = authRouter;

require("dotenv").config();
const express = require("express");
const app = express();
const connectDB = require("./config/databse");
const cors = require("cors");

app.use(express.json());

app.use(
  cors({
    origin: "*", // simpler now
  })
);

// root route
app.get("/", (req, res) => {
  res.send("Hello");
});

const authRouter = require("./routes/auth");
const bookRouter = require("./routes/bookRouter");
const uploadRouter = require("./routes/uploadRouter");
const bookingRouter = require("./routes/bookingRouter");
const reviewRouter = require("./routes/reviewRouter");

app.use("/", authRouter);
app.use("/", uploadRouter);
app.use("/", bookingRouter);  // ← bookingRouter BEFORE bookRouter
app.use("/", bookRouter);
app.use("/", reviewRouter);

connectDB()
  .then(() => {
    console.log("DB connection Success");

    const PORT = 7777;
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("DB connection failed:", err.message);
  });