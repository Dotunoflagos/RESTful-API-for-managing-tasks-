const Task = require("../models/taskModel");
const User = require("../models/userModel");
const { sendEmail } = require("../utils/sendEmail");

// Create a new task (Accessible by Admin)
exports.createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, dueDate, priority } = req.body;
    const userAssignedTo = await User.findById(assignedTo);
    if (!userAssignedTo) {
      return res.status(404).json({ message: "User not found" });
    }

    const task = new Task({
      title,
      description,
      createdBy: req.user._id,
      assignedTo,
      dueDate,
      priority,
    });

    const savedTask = await task.save();
    savedTask.assignedTo.name = `${userAssignedTo.lastname} ${userAssignedTo.firstname}`;

    await sendEmail(req.user, savedTask, "taskAssigned");
    await sendEmail(userAssignedTo, savedTask, "taskAssigned");
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get all tasks (Accessible by Admin and Members)
exports.getAllTasks = async (req, res) => {
  try {
    const { status } = req.query;
    let filter = {};

    if (req.user.role === "Member") {
      filter.assignedTo = req.user._id;
    }

    if (status) {
      filter.status = status;
    }

    const tasks = await Task.find(filter).populate("assignedTo");
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Update a task by ID (Admin or Member)
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const task = await Task.findByIdAndUpdate(id, updatedData, { new: true });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    const AssignedTo = await User.findById(task.assignedTo);
    const createdBy = await User.findById(task.createdBy);
    task.assignedTo.name = `${AssignedTo.lastname} ${AssignedTo.firstname}`;

    if (task.status === "Done") {
      await sendEmail(createdBy, task, "taskCompleted");
      await sendEmail(AssignedTo, task, "taskCompleted");
    } else {
      await sendEmail(createdBy, task, "taskUpdated");
      await sendEmail(AssignedTo, task, "taskUpdated");
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete a task by ID (Admin-only route)
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findByIdAndDelete(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const userAssignedTo = await User.findById(task.assignedTo);
    task.assignedTo.name = `${userAssignedTo.lastname} ${userAssignedTo.firstname}`;

    await sendEmail(req.user, task, "taskDeleted");
    await sendEmail(userAssignedTo, task, "taskDeleted");
    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
