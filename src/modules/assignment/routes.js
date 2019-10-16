const express = require('express')
const router = express.Router()
const { verifyToken } = require('../authentication/controller')
const { getPersonAssignments, getAssignmentById, createAssignment, updateLecturerApprove, joinAssignment } = require('./controller')

router.get('/', verifyToken, getPersonAssignments)
router.get('/detail', verifyToken, getAssignmentById)
router.post('/', verifyToken, createAssignment)
router.post('/join-assignment', verifyToken, joinAssignment)
router.patch('/lecturer', verifyToken, updateLecturerApprove)

module.exports = router
