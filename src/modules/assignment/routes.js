const express = require('express')
const router = express.Router()
const { verifyToken } = require('../authentication/controller')
const { getStudentAssignments, getListAssignmentSpecifyCourse, getAssignmentsDetailById, getAssignmentProjectByStudentId, getProjectRequest, createAssignment, updateProjectStatus, updateLecturerApprove, joinAssignment } = require('./controller')

router.get('/', verifyToken, getStudentAssignments)
router.get('/list-assignment', verifyToken, getListAssignmentSpecifyCourse)
router.get('/detail/:assignment_id', verifyToken, getAssignmentsDetailById)
router.get('/projects', verifyToken, getAssignmentProjectByStudentId)
router.get('/requests', verifyToken, getProjectRequest)
router.post('/', verifyToken, createAssignment)
router.post('/join-assignment', verifyToken, joinAssignment)
router.patch('/lecturer', verifyToken, updateLecturerApprove)
router.patch('/project', verifyToken, updateProjectStatus)

module.exports = router
