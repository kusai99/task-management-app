require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const sequelize = require("./config/Database");
const redisClient = require("./config/Redis");
const authMiddleware = require("./utils/Auth");

const authRoutes = require("./routes/AuthRoutes");
const taskRoutes = require("./routes/TaskRoutes"); // Updated route import

const app = express();
const PORT = process.env.PORT || 4000;

var cors = require("cors");
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/tasks", authMiddleware, taskRoutes); // Updated route path for tasks

// Start server with retry logic for the mysql db connection
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected...");
    await sequelize.sync({ alter: true });
    app.listen(PORT, () => {
      console.log(`TEST: Server is running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Database connection error:", err);
    setTimeout(startServer, 5000);
  }
};

startServer();

// Connect to the Redis client
redisClient
  .connect()
  .then(() => {
    console.log("Redis connected...");
  })
  .catch((err) => {
    console.error("Redis connection failed:", err);
  });

redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});
