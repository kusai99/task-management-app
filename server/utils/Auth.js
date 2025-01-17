const jwt = require("jsonwebtoken");
const redisClient = require("../config/Redis"); // Import Redis client

// Middleware for JWT token authorization with blacklist check
module.exports = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(403).send("Token is missing.");
  }

  try {
    // Check if token is blacklisted
    const isBlacklisted = await redisClient.get(`blacklistedToken:${token}`);
    if (isBlacklisted) {
      return res.status(401).send("Token is invalid or has been blacklisted.");
    }

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).send("Invalid token.");
      }
      req.user = decoded;
      next();
    });
  } catch (error) {
    console.error(`Error in auth middleware: ${error.message}`);
    res.status(500).send("Internal server error.");
  }
};
