const express = require('express')
const router = express.Router()
const controller = require('./controller')
const { verifyToken } = require('../authentication/controller')

router.get('/:id', controller.getProjectPage)

router.post('/external', verifyToken, controller.createProject)

router.patch('/', verifyToken, controller.updateProjectDetail)

router.patch('/counting', controller.updateProjectCount)

router.delete('/:id', controller.deleteProject)

module.exports = router
