const Task = require('../Model/taskmodel');

// Create Task
const createTask = async (req, res) => {
  try {
    const { assignedTo, taskTitle, description, companyId  } = req.body;

    if (!assignedTo || !taskTitle || !description) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newTask = new Task({
      assignedTo,
      taskTitle,
      description,
      status: 'pending',
      companyId,
    });

    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (error) {
    console.error("Error creating task:", error.message);
    res.status(500).json({ message: "Server error while creating task" });
  }
};


// Get All Tasks
const getTasks = async (req, res) => {
  try {
    const { assignedTo, companyId } = req.query;

    if (!companyId) {
      return res.status(400).json({ message: "Missing companyId in request" });
    }

    const query = {
      companyId,
      ...(assignedTo && { assignedTo })
    };

    const tasks = await Task.find(query).sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error getting tasks:", error.message);
    res.status(500).json({ message: "Server error while fetching tasks" });
  }
};




// Update Task
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      console.log(`Task not found: ${req.params.id}`);
      return res.status(404).json({ message: "Task not found" });
    }
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(updatedTask);
  } catch (error) {
    console.error("Error updating task:", error.message);
    res.status(500).json({ message: "Server error while updating task" });
  }
};

// Delete Task
const deleteTask = async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error.message);
    res.status(500).json({ message: "Server error while deleting task" });
  }
};

module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
};