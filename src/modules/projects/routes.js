const express = require('express')
const router = express.Router()
const controller = require('./controller')
const { verifyToken } = require('../authentication/controller')

router.get('/', controller.getProjectPage)
router.get('/Top-Project', controller.getTopProject)
router.get('/:page', controller.getAllProjects)

router.post('/', verifyToken, controller.createProject)
router.post('/add-external-to-assignment', verifyToken, controller.addProjectExternalToAssignment)

router.patch('/', verifyToken, controller.updateProjectDetail)

router.patch('/claping', controller.updateProjectClap)

router.delete('/:id', controller.deleteProject)

module.exports = router
