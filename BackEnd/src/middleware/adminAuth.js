// const jwt = require("jsonwebtoken");

// const User = require("../models/user");

// const userAuth = async (req, resp, next) => {
//   try {
//     const cookies = req.cookies;
//     console.log(cookies);
//     const { token } = cookies;
//     if (!token) {
//       throw new Error("No tokens Error");
//     }
//     //validate the token
//     const decodedMessage = await jwt.verify(token, process.env.JWT_SECRET);
//     console.log(decodedMessage);
//     const { _id } = decodedMessage;
//     // console.log(_id);
//     const userbyid = await User.findById(_id);
//     if (!userbyid) {
//       throw new Error("No user");
//     }
//     req.user = userbyid;
//     // console.log(userbyid);
//     next();
//     // resp.send(userbyid);
//   } catch (err) {
//     resp.status(400).send("ERROR: " + err.message);
//   }
// };
// module.exports = {
//   // adminAuth,
//   userAuth,
// };

const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new Error("No token");
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded._id);
    if (!user) {
      throw new Error("User not found");
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  userAuth,
};