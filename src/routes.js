const express = require('express')
const router = express.Router()

const projectRoutes = require('./modules/projects/routes')
const userRoutes = require('./modules/users/routes')
const outsiderRoutes = require('./modules/outsiders/routes')

router.use('/projects', projectRoutes)
router.use('/users', userRoutes)
router.use('/outsiders', outsiderRoutes)

module.exports = router
