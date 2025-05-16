const express = require("express");
const { createTask, getAllTasks, updateTask, deleteTask } = require("../controllers/taskController");
const { isAdmin, isAdminOrMember } = require("../middleware/authMiddleware");

const router = express.Router();

// Create a new task (Accessible by Admin)
router.post("/tasks", isAdmin, createTask);

// Get all tasks (Accessible by Admin and Members)
router.get("/tasks", isAdminOrMember, getAllTasks);

// Update a task by ID (Admin or member)
router.put("/tasks/:id", isAdminOrMember, updateTask);

// Delete a task by ID (Admin-only route)
router.delete("/tasks/:id", isAdmin, deleteTask);

module.exports = router;