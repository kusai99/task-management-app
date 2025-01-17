const express = require("express");
const TaskController = require("../controllers/TaskController");
const authMiddleware = require("../utils/Auth");
const TaskValidation = require("../validators/TaskValidation");
const router = express.Router();
router.use(authMiddleware);

router.get("/types", TaskController.getTaskTypes);

// Get all tasks for the authenticated user
router.get("/", TaskController.getTasks);

// Get a single task for the authenticated user by task ID
router.get("/:id", TaskValidation.validateTaskId(), TaskController.getTask);

// Search tasks based on criteria for the authenticated user
router.post("/search", TaskController.searchTasks);

// Create a new task for the authenticated user
router.post(
  "/",
  TaskValidation.createOrUpdateTaskValidation(),
  TaskController.createTask
);

// Update an existing task for the authenticated user
router.put(
  "/:id",
  TaskValidation.validateTaskId(),
  TaskValidation.createOrUpdateTaskValidation(),
  TaskController.updateTask
);

// Delete a task for the authenticated user by task ID
router.delete(
  "/:id",
  TaskValidation.validateTaskId(),
  TaskController.deleteTask
);

module.exports = router;
