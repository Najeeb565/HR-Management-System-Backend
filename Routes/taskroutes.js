// routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const {
  createTask, getTasks, updateTask, deleteTask
} = require('../Controller/taskcontroller');

router.post('/tasks', createTask);
router.get('/', getTasks);
router.put('/tasks/:id', updateTask);
router.delete('/:id', deleteTask);

module.exports = router;
