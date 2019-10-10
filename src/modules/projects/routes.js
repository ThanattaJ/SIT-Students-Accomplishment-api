const express = require('express')
const router = express.Router()
const controller = require('./controller')
const { verifyToken } = require('../authentication/controller')

router.get('/', controller.getProjectPage)
router.get('/:page/:year', controller.getAllProjects)

router.post('/external', verifyToken, controller.createProject)

router.patch('/', verifyToken, controller.updateProjectDetail)

router.patch('/claping', controller.updateProjectClap)

router.delete('/:id', controller.deleteProject)

module.exports = router
