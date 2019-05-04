const express = require('express')
const router = express.Router()
const controller = require('./controller')

router.get('/:id', controller.getProjectPage)

router.post('/external', controller.createProject)

router.patch('/', controller.updateProjectDetail)

router.patch('/counting', controller.updateProjectCount)

router.delete('/:id', controller.deleteProject)

module.exports = router
