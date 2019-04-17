const express = require('express')
const router = express.Router()

const projectRoutes = require('./modules/projects/routes')
const userRoutes = require('./modules/users/routes')
const outsiderRoutes = require('./modules/outsiders/routes')
const tagRoutes = require('./modules/tags/routes')
const fileRoutes = require('./modules/files/routes')

router.use('/projects', projectRoutes)
router.use('/users', userRoutes)
router.use('/outsiders', outsiderRoutes)
router.use('/tags', tagRoutes)
router.use('/files', fileRoutes)

module.exports = router
