// routes/taskRoutes.js
const express = require('express');
const router = express.Router();

const {
  createTask, getTasks, updateTask, deleteTask
} = require('../Controller/taskcontroller');

const authenticate = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

// ✅ Apply auth + role protection
router.post('/post', authenticate, authorizeRoles("admin"), createTask);
router.get('/', authenticate, authorizeRoles("admin", "employee"), getTasks);
router.put('/:id', authenticate, authorizeRoles("admin" , "employee"), updateTask);
router.delete('/:id', authenticate, authorizeRoles("admin"), deleteTask);

module.exports = router;
