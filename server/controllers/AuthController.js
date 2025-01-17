const AuthService = require("../services/AuthService");
const AuthValidation = require("../validators/AuthValidation");
const { validationResult } = require("express-validator");
const validationErrorHandler = require("../validators/ValidationErrorHandler");

const AuthController = {
  // Validate the registration payload and register the new user
  register: [
    ...AuthValidation.register,
    validationErrorHandler,
    async (req, res) => {
      try {
        const { username, password, email } = req.body;
        const user = await AuthService.register(username, password, email);
        res.status(201).json({
          message: "User registered successfully",
          userId: user.id,
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    },
  ],

  login: [
    // Validate the login payload and handle login
    ...AuthValidation.login,
    validationErrorHandler,
    async (req, res) => {
      try {
        const { username, password } = req.body;
        const token = await AuthService.login(username, password);
        res.json({ message: "Login successful", token });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    },
  ],

  logout: [
    async (req, res) => {
      try {
        const token = req.header("Authorization")?.split(" ")[1]; // Extract token from Authorization header
        if (!token) {
          return res.status(400).json({ message: "Token not provided" });
        }

        await AuthService.logout(token); // Invalidate the token (e.g., remove from cache or database)
        res.json({ message: "Logout successful" });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    },
  ],
};

module.exports = AuthController;
