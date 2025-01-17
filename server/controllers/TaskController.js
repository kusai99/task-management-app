const TaskService = require("../services/TaskService");
const logger = require("../utils/Logger");
const { validationResult } = require("express-validator");
const TaskValidation = require("../validators/TaskValidation");
const validationErrorHandler = require("../validators/ValidationErrorHandler");
const TaskType = require("../types/TaskType"); // Import the TaskType Enum

const TaskController = {
  // Get all the tasks of the authenticated user
  getTasks: async (req, res) => {
    try {
      const tasks = await TaskService.getTasksByUser(req.user.userId);

      res.json(tasks);
    } catch (error) {
      logger.log(
        "Error fetching tasks for user ID " +
          req.user.userId +
          ": " +
          error.message
      );
      res.status(500).json({ error: error.message });
    }
  },

  // Get all the tasks of the authenticated user and filter them by the specified criteria in the request payload.
  searchTasks: async (req, res) => {
    try {
      const searchCriteria = req.body;
      const tasks = await TaskService.getTasksByUserAndCriteria(
        req.user.userId,
        searchCriteria
      );

      res.json(tasks);
    } catch (error) {
      logger.log(
        "Error fetching tasks for user ID " +
          req.user.userId +
          ": " +
          error.message
      );
      res.status(500).json({ error: error.message });
    }
  },

  // Get a single task for the authenticated user with the task id specified in the request params.
  getTask: [
    TaskValidation.validateTaskId(),
    async (req, res) => {
      try {
        const task = await TaskService.getTaskById(
          req.params.id,
          req.user.userId
        );

        if (!task) {
          logger.log(
            `Task not found with ID: ${req.params.id} for user ID: ${req.user.userId}`
          );
          return res.status(404).json({ error: "Task not found" });
        }

        res.json(task);
      } catch (error) {
        logger.log(
          `Error fetching task with ID: ${req.params.id} for user ID: ${req.user.userId}: ${error.message}`
        );
        res.status(500).json({ error: error.message });
      }
    },
  ],

  // Create a new task and invalidate the tasks cache
  createTask: [
    ...TaskValidation.createOrUpdateTaskValidation(),
    validationErrorHandler,
    async (req, res) => {
      const taskData = {
        taskType: req.body.taskType, // Using TaskType Enum
        title: req.body.title,
        description: req.body.description,
        userId: req.user.userId,
      };

      try {
        logger.log("Creating task: " + JSON.stringify(taskData));
        const task = await TaskService.createTask(taskData);
        return res.status(201).json(task);
      } catch (error) {
        if (error.name === "SequelizeUniqueConstraintError") {
          return res.status(409).json({ error: error.message });
        }
        logger.log("Error creating task: " + error.message);
        return res.status(500).json({ error: error.message });
      }
    },
  ],

  // Update a single task for the authenticated user with the task id specified in the request param
  updateTask: [
    TaskValidation.validateTaskId(),
    ...TaskValidation.createOrUpdateTaskValidation(),
    validationErrorHandler,
    async (req, res) => {
      try {
        const existingTask = await TaskService.getTaskById(
          req.params.id,
          req.user.userId
        );
        if (!existingTask) {
          return res.status(404).json({ error: "Task not found" });
        }

        const { taskType, title, description } = req.body;
        if (
          existingTask.taskType === taskType &&
          existingTask.title === title &&
          existingTask.description === description
        ) {
          logger.log("No changes detected, skip update.");
          return res.status(200).json({ message: "No changes detected" });
        }

        await TaskService.updateTask(req.params.id, req.user.userId, req.body);
        return res.status(200).json({ message: "Task updated successfully" });
      } catch (error) {
        logger.log(
          "Error updating task with ID " + req.params.id + ": " + error.message
        );
        if (error.name === "SequelizeUniqueConstraintError") {
          return res.status(409).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
      }
    },
  ],

  // Delete a single task for the authenticated user with the task id specified in the request param
  deleteTask: [
    TaskValidation.validateTaskId(),
    async (req, res) => {
      try {
        const existingTask = await TaskService.getTaskById(
          req.params.id,
          req.user.userId
        );
        if (!existingTask) {
          return res.status(404).json({ error: "Task not found" });
        }

        await TaskService.deleteTask(req.params.id, req.user.userId);
        res.status(204).send();
      } catch (error) {
        logger.log(
          "Error deleting task with ID " + req.params.id + ": " + error.message
        );
        res.status(500).json({ error: error.message });
      }
    },
  ],
  getTaskTypes: [
    (req, res) => {
      try {
        const taskTypes = Object.values(TaskType); // Get all values from the TaskType Enum
        res.json({ taskTypes });
      } catch (error) {
        logger.log("Error fetching task types: " + error.message);
        res.status(500).json({ error: error.message });
      }
    },
  ],
};

module.exports = TaskController;
