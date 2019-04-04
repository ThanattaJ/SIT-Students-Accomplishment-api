const express = require('express')
const router = express.Router()

const projectRoutes = require('./modules/projects/routes')
const userRoutes = require('./modules/users/routes')

router.use('/projects', projectRoutes)
router.use('/users', userRoutes)

module.exports = router
