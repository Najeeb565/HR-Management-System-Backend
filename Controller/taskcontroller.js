const Task = require('../Model/taskmodel');

// POST: Create a new task
const createTask = async (req, res) => {
  try {
    const { email, taskTitle, description } = req.body;
    const task = new Task({ email, taskTitle, description, status: 'pending' });
    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
};

// GET: Get all tasks
const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
};

// DELETE: Delete a task
const deleteTask = async (req, res) => {
  try {
    const deleted = await Task.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Task not found' });
    res.status(200).json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};


module.exports = { createTask, getAllTasks, deleteTask };
