const mongoose = require('mongoose');

// Task Schema
const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    enum: ['To-Do', 'In Progress', 'Done'],  // Status options
    default: 'To-Do',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Reference to a User model who created the task
    required: true,
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Reference to a User model
  },
  dueDate: {
    type: Date,
    required: false,
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],  // Priority options
    default: 'Medium',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to update `updatedAt` on save
taskSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Create Task Model
const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
