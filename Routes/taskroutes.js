// routes/taskRoutes.js
const express = require('express');
const router = express.Router();

const {
  createTask, getTasks, updateTask, deleteTask
} = require('../Controller/taskcontroller');

const authenticate = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

// ✅ Apply auth + role protection
router.post('/post', authenticate,  createTask);
router.get('/', authenticate,  getTasks);
router.put('/:id', authenticate, updateTask);
router.delete('/:id', authenticate,  deleteTask);

module.exports = router;
