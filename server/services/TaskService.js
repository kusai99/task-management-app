const TaskRepository = require("../repositories/TaskRepository");
const redisClient = require("../config/Redis");
const TaskFactory = require("../services/TaskFactory");
const logger = require("../utils/Logger");
const { Op } = require("sequelize");
const TaskType = require("../types/TaskType");

const TaskService = {
  // Get all the tasks of the validated user from the cache (if there is valid tasks cache) or from the Task table through the TaskRepository
  getTasksByUser: async (userId) => {
    try {
      logger.log(`Fetching tasks for user ${userId}`);
      if (!redisClient.isOpen) {
        const errorMessage = "Redis client is not connected.";
        logger.log(errorMessage);
        throw new Error(errorMessage);
      }

      const cacheKey = `user:${userId}:tasks`;
      const cachedTasks = await redisClient.get(cacheKey);
      if (cachedTasks) return JSON.parse(cachedTasks);

      const tasks = await TaskRepository.findByUserId(userId);
      await redisClient.set(cacheKey, JSON.stringify(tasks), "EX", 3600);
      return tasks;
    } catch (error) {
      logger.log(`Error fetching tasks for user ${userId}: ${error.message}`);
      throw new Error(`Failed to fetch tasks: ${error.message}`);
    }
  },

  // Get tasks by userId and criteria
  getTasksByUserAndCriteria: async (userId, searchCriteria) => {
    try {
      const { taskType, title, description, dateFrom, dateTo } = searchCriteria;
      logger.log(`Fetching tasks for user ${userId}`);

      const filters = { userId };

      const isSearchCriteriaEmpty =
        Object.values(searchCriteria).every((value) => value === null) ||
        searchCriteria.length === 0;
      if (isSearchCriteriaEmpty) {
        return TaskService.getTasksByUser(userId);
      }

      if (taskType) {
        filters.taskType = { [Op.eq]: taskType };
      }
      if (title) {
        filters.title = { [Op.like]: `%${title}%` };
      }
      if (description) {
        filters.description = { [Op.like]: `%${description}%` };
      }
      if (dateFrom) {
        filters.updatedAt = {
          ...filters.updatedAt,
          [Op.gte]: new Date(dateFrom),
        };
      }
      if (dateTo) {
        filters.updatedAt = {
          ...filters.updatedAt,
          [Op.lte]: new Date(dateTo),
        };
      }

      const tasks = await TaskRepository.findByUserIdAndFilters(
        userId,
        filters
      );

      return tasks;
    } catch (error) {
      logger.log(`Error fetching tasks for user ${userId}: ${error.message}`);
      throw new Error(`Failed to fetch tasks: ${error.message}`);
    }
  },

  // Get a single task by taskId and userId
  getTaskById: async (taskId, userId) => {
    try {
      logger.log(`Fetching task with ID ${taskId} for user ${userId}`);
      return await TaskRepository.findByIdAndUserId(taskId, userId);
    } catch (error) {
      logger.log(
        `Error fetching task ${taskId} for user ${userId}: ${error.message}`
      );
      throw new Error(`Failed to fetch task  ${error.message}`);
    }
  },

  // Create a new task and invalidate the tasks cache
  createTask: async (taskData) => {
    try {
      logger.log(
        `Creating task for user ${taskData.userId} of type ${taskData.taskType}`
      );
      const task = await TaskFactory.createTask(taskData);
      await redisClient.del(`user:${taskData.userId}:tasks`);
      return task;
    } catch (error) {
      logger.log(
        `Error creating task for user ${taskData.userId}: ${error.message}`
      );
      throw new Error(`Failed to create task: ${error.message}`);
    }
  },

  // Update a task and invalidate the tasks cache
  updateTask: async (taskId, userId, updatedData) => {
    try {
      logger.log(`Updating task ${taskId} for user ${userId}`);

      if (!Object.values(TaskType).includes(updatedData.taskType)) {
        const errorMessage = `Invalid task type provided: ${
          updatedData.taskType
        }. Must be one of the following: [${Object.values(TaskType).join(
          ", "
        )}]`;
        logger.log(errorMessage);
        throw new Error(errorMessage);
      }

      await TaskRepository.updateTask(taskId, { ...updatedData, userId });

      await redisClient.del(`user:${userId}:tasks`);

      return { message: "Task updated successfully" };
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        logger.log(
          `A ${updatedData.taskType} task with title '${updatedData.title}' already exists.`
        );
        throw new Error(
          `A ${updatedData.taskType} task with title '${updatedData.title}' already exists.`
        );
      }
      logger.log(
        `Error updating task ${taskId} for user ${userId}: ${error.message}`
      );
      throw new Error(
        `Failed to update task with ID ${taskId} for user ${userId}: ${error.message}`
      );
    }
  },

  // Delete a task and invalidate the tasks cache
  deleteTask: async (taskId, userId) => {
    try {
      logger.log(`Deleting task ${taskId} for user ${userId}`);
      await TaskRepository.deleteTask(taskId);

      await redisClient.del(`user:${userId}:tasks`);

      return { message: "Task deleted successfully" };
    } catch (error) {
      logger.log(
        `Error deleting task ${taskId} for user ${userId}: ${error.message}`
      );
      throw new Error(
        `Failed to delete task with ID ${taskId} for user ${userId}: ${error.message}`
      );
    }
  },
};

module.exports = TaskService;
