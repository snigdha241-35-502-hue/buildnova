const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "buildnova_secret_key";

const protect = (req, res, next) => {
  try {
    // Get Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "No token provided"
      });
    }

    // Expected format: Bearer TOKEN
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Invalid authorization format"
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token missing"
      });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Store decoded user information
    req.user = {
      id: decoded.id,
      role: decoded.role
    };

    next();

  } catch (error) {
    console.error("AUTH ERROR:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired. Please login again."
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid token. Please login again."
    });
  }
};

module.exports = protect;