const { body, param } = require("express-validator");
const TaskType = require("../types/TaskType");

class TaskValidation {
  static createOrUpdateTaskValidation() {
    const taskTypeValues = Object.values(TaskType).join(", ");
    return [
      // Validate that the taskType in the request body is one of the taskTypes in the TaskType enum
      body("taskType")
        .isIn(Object.values(TaskType))
        .withMessage(
          `Task Type must be one of the following: [${taskTypeValues}]`
        ),

      // Validate task title length
      body("title")
        .isString()
        .isLength({ max: 100 })
        .withMessage("Title must be a maximum of 100 characters"),

      // Validate description data type
      body("description")
        .optional({ nullable: true })
        .isString()
        .withMessage("Description must be a string or null"),
    ];
  }

  // Validate that the provided task ID is an integer
  static validateTaskId() {
    return [
      param("id").isInt({ gt: 0 }).withMessage("ID must be a positive integer"),
    ];
  }
}

module.exports = TaskValidation;
