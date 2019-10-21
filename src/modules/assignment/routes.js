const express = require('express')
const router = express.Router()
const { verifyToken } = require('../authentication/controller')
const constroller = require('./controller')

router.get('/list-assignment', verifyToken, constroller.getListAssignmentSpecifyCourse)
router.get('/detail/:assignment_id', verifyToken, constroller.getAssignmentsDetailById)
router.get('/projects', verifyToken, constroller.getAssignmentProjectByStudentId)
router.get('/requests', verifyToken, constroller.getProjectRequest)
router.post('/', verifyToken, constroller.createAssignment)
router.post('/join-assignment', verifyToken, constroller.joinAssignment)
router.patch('/lecturer', verifyToken, constroller.updateLecturerApprove)
router.patch('/', verifyToken, constroller.updateAssignment)
router.patch('/project', verifyToken, constroller.updateProjectStatus)

module.exports = router
