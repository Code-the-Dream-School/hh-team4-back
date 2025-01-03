const jwt = require("jsonwebtoken");
const User = require("../models/UserModel"); // Adjust the path to your User model

const authenticate = async (req, res, next) => {
  const authHeader = req.header("Authorization");

  // Check if the Authorization header is present
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Access denied. No token provided.",
    });
  }

  const token = authHeader.split(" ")[1]; // Extract token from header

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch the full user details, including `store`
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Attach the full user object to the request
    req.user = { id: user.id, role: user.role, store: user.store };
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid token.",
    });
  }
};

module.exports = authenticate;
