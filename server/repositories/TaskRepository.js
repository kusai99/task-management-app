const Task = require("../models/Task"); // Import your Task model
const TaskType = require("../types/TaskType"); // Import TaskType Enum

// Find tasks by userId and filters
async function findByUserIdAndFilters(userId, filters) {
  const searchFilters = { userId, ...filters };
  try {
    return await Task.findAll({ where: searchFilters });
  } catch (error) {
    throw new Error(`Error in findByUserIdAndFilters: ${error.message}`);
  }
}

// Find tasks by userId
async function findByUserId(userId) {
  try {
    return await Task.findAll({ where: { userId } });
  } catch (error) {
    throw new Error(`Error in findByUserId: ${error.message}`);
  }
}

// Find task by taskId and userId
async function findByIdAndUserId(taskId, userId) {
  try {
    return await Task.findOne({ where: { id: taskId, userId } });
  } catch (error) {
    throw new Error(`Error in findByIdAndUserId: ${error.message}`);
  }
}

// Create a new task
async function createTask(taskData) {
  try {
    return await Task.create(taskData);
  } catch (error) {
    throw new Error(`Error in createTask: ${error.message}`);
  }
}

// Update an existing task
async function updateTask(taskId, updatedData) {
  try {
    return await Task.update(updatedData, { where: { id: taskId } });
  } catch (error) {
    throw new Error(`Error in updateTask: ${error.message}`);
  }
}

// Delete a task
async function deleteTask(taskId) {
  try {
    return await Task.destroy({ where: { id: taskId } });
  } catch (error) {
    throw new Error(`Error in deleteTask: ${error.message}`);
  }
}

// Export all functions
module.exports = {
  findByUserIdAndFilters,
  findByUserId,
  findByIdAndUserId,
  createTask,
  updateTask,
  deleteTask,
};
