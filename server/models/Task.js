const { DataTypes } = require("sequelize");
const sequelize = require("../config/Database");
const TaskType = require("../types/TaskType"); // Import TaskType Enum

const Task = sequelize.define(
  "Task",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true, // Ensure userId is an integer
      },
    },
    taskType: {
      type: DataTypes.ENUM(...Object.values(TaskType)),
      allowNull: false,
      validate: {
        isIn: {
          args: [Object.values(TaskType)],
          msg: `taskType must be one of the following: ${Object.values(
            TaskType
          ).join(", ")}`,
        },
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true, // Ensure title is not empty
      },
    },
    description: {
      type: DataTypes.STRING(2048),
      allowNull: true,
      validate: {
        notEmpty: true, // Ensure description is not empty
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    tableName: "tasks", // Ensure the table name is `tasks`
  }
);

module.exports = Task;
