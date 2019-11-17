const express = require('express')
const router = express.Router()
const { verifyToken } = require('../authentication/controller')
const controller = require('./controller')

router.get('/list-assignment', verifyToken, controller.getListAssignmentSpecifyCourse)
router.get('/detail/:assignment_id', verifyToken, controller.getAssignmentsDetailById)
router.get('/projects', verifyToken, controller.getAssignmentProjectByStudentId)
router.get('/requests', verifyToken, controller.getProjectRequest)
router.post('/', verifyToken, controller.createAssignment)
router.post('/join-assignment', verifyToken, controller.joinAssignment)
router.patch('/lecturer', verifyToken, controller.updateLecturerApprove)
router.patch('/', verifyToken, controller.updateAssignment)
router.patch('/projects', verifyToken, controller.updateProjectStatus)

module.exports = router
