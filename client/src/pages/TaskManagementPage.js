import React, { useState, useEffect } from "react";

import {
  Container,
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import axios from "../axios";

function TaskManagementPage({ token }) {
  const [tasks, setTasks] = useState([]);
  const [searchCriteria, setSearchCriteria] = useState({
    title: "",
    description: "",
    taskType: "",
    dateFrom: "",
    dateTo: "",
  });
  const [editingTask, setEditingTask] = useState(null);
  const [editTaskData, setEditTaskData] = useState({});
  const [creatingTask, setCreatingTask] = useState(false); // State for create task dialog
  const [newTaskData, setNewTaskData] = useState({
    title: "",
    description: "",
    taskType: "",
  });
  const [hasSearched, setHasSearched] = useState(false); // Track if search was performed

  const taskTypes = [
    { value: "work", label: "Work" },
    { value: "personal", label: "Personal" },
    { value: "research", label: "Research" },
    { value: "social", label: "Social" },
  ];

  useEffect(() => {
    if (!newTaskData.taskType) {
      setNewTaskData((prevData) => ({
        ...prevData,
        taskType: taskTypes[0].value, // Preselect the first task type
      }));
    }
  }, [newTaskData.taskType]);

  useEffect(() => {
    if (editingTask && !editTaskData.taskType) {
      setEditTaskData((prevData) => ({
        ...prevData,
        taskType: taskTypes[0].value, // Preselect the first task type
      }));
    }
  }, [editingTask, editTaskData.taskType]);
  const handleCriteriaChange = (e) => {
    setSearchCriteria({ ...searchCriteria, [e.target.name]: e.target.value });
  };

  const handleSearch = async () => {
    try {
      setHasSearched(true); // Mark that a search was performed
      console.log("Sending search criteria:", searchCriteria);
      const response = await axios.post("/tasks/search", searchCriteria, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(response.data || []);
    } catch (err) {
      console.error("Failed to search tasks:", err);
      setTasks([]);
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setEditTaskData(task);
  };

  const handleEditChange = (e) => {
    setEditTaskData({ ...editTaskData, [e.target.name]: e.target.value });
  };

  const handleEditSave = async () => {
    // Validate title and task type
    if (!editTaskData.title.trim()) {
      alert("Title is required.");
      return;
    }

    if (!editTaskData.description.trim()) {
      alert("Description is required.");
      return;
    }

    if (!editTaskData.taskType) {
      alert("Task type is required.");
      return;
    }

    try {
      const response = await axios.put(
        `/tasks/${editingTask.id}`,
        editTaskData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Task updated:", response.data);
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === editingTask.id ? response.data : task
        )
      );
      setEditingTask(null); // Close dialog
    } catch (err) {
      console.error("Failed to update task:", err);
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await axios.delete(`/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Task deleted:", taskId);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  };

  const handleCreateChange = (e) => {
    setNewTaskData({ ...newTaskData, [e.target.name]: e.target.value });
  };

  const handleCreateSave = async () => {
    if (!newTaskData.title.trim()) {
      alert("Title is required.");
      return;
    }

    if (!newTaskData.description.trim()) {
      alert("Description is required.");
      return;
    }

    if (!newTaskData.taskType) {
      alert("Task type is required.");
      return;
    }

    try {
      const response = await axios.post("/tasks", newTaskData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Task created:", response.data);
      setTasks((prevTasks) => [...prevTasks, response.data]);
      setCreatingTask(false); // Close dialog
      setNewTaskData({
        title: "",
        description: "",
        taskType: taskTypes[0].value,
      }); // Reset data and preselect the first taskType
    } catch (err) {
      console.error("Failed to create task:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <Container
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "0%",
      }}
    >
      <Button
        variant="contained"
        color="secondary"
        onClick={handleLogout}
        sx={{
          position: "absolute",
          top: 16,
          right: 16, // Positioned slightly from the top-right corner
        }}
      >
        Logout
      </Button>

      <Typography
        variant="h5"
        gutterBottom
        sx={{ marginTop: "80px", textAlign: "center" }} // Adjusting margin-top to push the form lower and center the text
      >
        Task Management
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          mb: 3,
          width: "100%",
          maxWidth: 600,
        }}
      >
        <TextField
          name="title"
          label="Title"
          value={searchCriteria.title}
          onChange={handleCriteriaChange}
          onKeyDown={handleKeyDown}
          fullWidth
        />
        <TextField
          name="description"
          label="Description"
          value={searchCriteria.description}
          onChange={handleCriteriaChange}
          onKeyDown={handleKeyDown}
          fullWidth
        />
        <FormControl fullWidth>
          <InputLabel id="taskType-label">Task Type</InputLabel>
          <Select
            labelId="taskType-label"
            name="taskType"
            value={searchCriteria.taskType}
            onChange={handleCriteriaChange}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {taskTypes.map((type) => (
              <MenuItem key={type.value} value={type.value}>
                {type.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          name="dateFrom"
          label="Date From"
          type="date"
          value={searchCriteria.dateFrom}
          onChange={handleCriteriaChange}
          onKeyDown={handleKeyDown}
          InputLabelProps={{
            shrink: true,
          }}
          fullWidth
        />
        <TextField
          name="dateTo"
          label="Date To"
          type="date"
          value={searchCriteria.dateTo}
          onChange={handleCriteriaChange}
          onKeyDown={handleKeyDown}
          InputLabelProps={{
            shrink: true,
          }}
          fullWidth
        />
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button onClick={handleSearch} variant="contained" color="primary">
            Search
          </Button>
          <Button
            onClick={() => setCreatingTask(true)}
            variant="contained"
            color="secondary"
          >
            Create Task
          </Button>
        </Box>
      </Box>

      {hasSearched && tasks.length === 0 ? (
        <Typography variant="body1" color="textSecondary">
          No tasks found. Please refine your search criteria.
        </Typography>
      ) : (
        tasks.map((task) => (
          <Card key={task.id} sx={{ mb: 2, width: "100%", maxWidth: 600 }}>
            <CardContent>
              <Typography variant="h6">{task.title}</Typography>
              <Typography color="textSecondary">{task.description}</Typography>
              <Typography variant="body2">
                <strong>Type:</strong> {task.taskType}
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => handleEdit(task)}
              >
                Edit
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => handleDelete(task.id)}
              >
                Delete
              </Button>
            </CardActions>
          </Card>
        ))
      )}

      {/* Edit Task Dialog */}
      <Dialog open={!!editingTask} onClose={() => setEditingTask(null)}>
        <DialogTitle>Edit Task</DialogTitle>
        <DialogContent>
          <TextField
            name="title"
            label="Title"
            value={editTaskData.title || ""}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="description"
            label="Description"
            value={editTaskData.description || ""}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="edit-taskType-label">Task Type</InputLabel>
            <Select
              labelId="edit-taskType-label"
              name="taskType"
              value={editTaskData.taskType || ""}
              onChange={handleEditChange}
            >
              {taskTypes.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingTask(null)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleEditSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      {/* Create Task Dialog */}
      <Dialog open={creatingTask} onClose={() => setCreatingTask(false)}>
        <DialogTitle>Create Task</DialogTitle>
        <DialogContent>
          <TextField
            name="title"
            label="Title"
            value={newTaskData.title}
            onChange={handleCreateChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="description"
            label="Description"
            value={newTaskData.description}
            onChange={handleCreateChange}
            fullWidth
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="new-taskType-label">Task Type</InputLabel>
            <Select
              labelId="new-taskType-label"
              name="taskType"
              value={newTaskData.taskType}
              onChange={handleCreateChange}
            >
              {taskTypes.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreatingTask(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCreateSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default TaskManagementPage;
