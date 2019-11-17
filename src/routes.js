const express = require('express')
const router = express.Router()
const projectRoutes = require('./modules/projects/routes')
const userRoutes = require('./modules/users/routes')
const tagRoutes = require('./modules/tags/routes')
const fileRoutes = require('./modules/files/routes')
const authenRoutes = require('./modules/authentication/routes')
const courseRoute = require('./modules/course/routes')
const assignmentRoute = require('./modules/assignment/routes')

router.use('/projects', projectRoutes)
router.use('/users', userRoutes)
router.use('/tags', tagRoutes)
router.use('/files', fileRoutes)
router.use('/login', authenRoutes)
router.use('/course', courseRoute)
router.use('/assignment', assignmentRoute)

module.exports = router
