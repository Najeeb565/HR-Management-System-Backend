const Task = require('../Model/taskmodel');
const sendNotification = require("../utils/sendNotification");
const Admin = require("../Model/adminModel");
const Employee = require("../Model/employee");

// Create Task
const createTask = async (req, res) => {
  try {
    const { assignedTo, taskTitle, description, companyId, createdBy } = req.body;

    if (!assignedTo || !taskTitle || !description || !createdBy) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Get admin name
    const adminData = await Admin.findById(createdBy);
    const adminName = adminData?.name || "Admin";

    const newTask = new Task({
      assignedTo,
      taskTitle,
      description,
      status: 'pending',
      companyId,
      createdBy,
    });

    const savedTask = await newTask.save();

    // Notify employee with admin name
    await sendNotification({
      recipientId: assignedTo,
      role: "employee",
      title: "New Task Assigned",
      message: `${adminName} assigned you a task: "${savedTask.taskTitle}".`,
    });

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
      return res.status(404).json({ message: "Task not found" });
    }

    const previousStatus = task.status;
    const previousTitle = task.taskTitle;

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    // Get employee name
    const employeeData = await Employee.findById(task.assignedTo);
    const employeeName = employeeData?.firstName || "Employee";

    // If status updated, notify admin with employee name
    if (req.body.status && req.body.status !== previousStatus) {
      await sendNotification({
        recipientId: task.createdBy,
        role: "admin",
        title: "Task Status Updated",
        message: `${employeeName} updated task "${task.taskTitle}" to "${req.body.status}".`,
      });
    }

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

    // Get admin name
    const adminData = await Admin.findById(deletedTask.createdBy);
    const adminName = adminData?.name || "Admin";

    // Notify employee
    await sendNotification({
      recipientId: deletedTask.assignedTo,
      role: "employee",
      title: "Task Deleted",
      message: `${adminName} deleted your task "${deletedTask.taskTitle}".`,
    });

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
