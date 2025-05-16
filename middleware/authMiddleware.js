const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const authenticateToken = (req, res, next) => {
  const token = JSON.parse(req.cookies.Auth || false);
  if (!token) {
    console.log("Token not found in the request header");
    res.status(401).json({ message: "Authentication failed" });
    return res.redirect(301, "/login");
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log("Error verifying token:");
      res.status(403).json({ message: "Invalid token" });
      return res.redirect(301, "/login");
    }

    req.userId = user.userId;
    next();
  });
};

// Middleware to check for Admin role
const isAdmin = async (req, res, next) => {
  try {
    // Check if the token exists in the request headers
    const authCookie = req.cookies.Auth;

    if (!authCookie) {
      return res.status(401).json({ message: "Authorization token missing" });
    }

    // Parse and Verify the token
    const token = JSON.parse(authCookie); // Parse if it is stored as JSON
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch the user using the ID from the token
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Check if user is Admin
    if (user.role !== "Admin") {
      return res.status(403).json({ message: "Forbidden: Admins only" });
    }

    req.user = user; // Add user to the request object for further use
    next(); // Proceed to the next middleware/route handler
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Middleware to check if user is either Admin or Member
const isAdminOrMember = async (req, res, next) => {
  try {
    // Check if the token exists in the request headers
    const authCookie = req.cookies.Auth;

    if (!authCookie) {
      return res.status(401).json({ message: "Authorization token missing" });
    }

    // Parse and Verify the token
    const token = JSON.parse(authCookie);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch the user using the ID from the token
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "Admin" && user.role !== "Member") {
      return res
        .status(403)
        .json({ message: "Forbidden: You do not have access" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = { authenticateToken, isAdmin, isAdminOrMember };
