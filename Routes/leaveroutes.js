const express = require('express');
const router = express.Router();
const { createLeave, getLeaves,updateLeaveStatus} = require('../Controller/employeeleavecontroller');

router.post('/', createLeave);
router.get('/', getLeaves);
router.put('/:id/status', updateLeaveStatus);

module.exports = router;
