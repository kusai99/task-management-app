const Task = require("../models/Task");
const TaskRepository = require("../repositories/TaskRepository");
const TaskType = require("../types/TaskType");
const logger = require("../utils/Logger");

class TaskFactory {
  static async createTask(taskData) {
    const { taskType, title, description, userId } = taskData;

    // Validate taskType against TaskType enum
    if (!Object.values(TaskType).includes(taskType)) {
      const errorMessage = `Invalid task type provided: ${taskType}. Must be one of the following: [${Object.values(
        TaskType
      ).join(", ")}]`;
      logger.log(errorMessage);
      throw new Error(errorMessage);
    }

    try {
      return await TaskRepository.createTask(taskData);
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        const errorMessage = `A task with title '${taskData.title}' already exists.`;
        logger.log(errorMessage);
        throw new Error(errorMessage);
      }
      logger.log(`Error creating task for user ${userId}: ${error.message}`);
      throw new Error(`Error creating task: ${error.message}`);
    }
  }
}

module.exports = TaskFactory;
