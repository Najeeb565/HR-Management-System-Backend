
const express = require('express');
const router = express.Router();
const { createTask, getAllTasks, deleteTask } = require('../Controller/taskcontroller');

router.post('/tasks', createTask);      // ✅ POST route
router.get('/tasks', getAllTasks);      // ✅ GET route
router.delete('/tasks/:id', deleteTask); // ✅ DELETE route

module.exports = router;
