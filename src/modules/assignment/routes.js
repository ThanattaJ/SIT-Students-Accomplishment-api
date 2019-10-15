const express = require('express')
const router = express.Router()
const { verifyToken } = require('../authentication/controller')
const { getAllLecturerAssignments, getAssignmentById, createAssignment, updateLecturerApprove } = require('./controller')

router.get('/', verifyToken, getAllLecturerAssignments)
router.get('/detail', verifyToken, getAssignmentById)
router.post('/', verifyToken, createAssignment)
router.patch('/lecturer', verifyToken, updateLecturerApprove)

module.exports = router
