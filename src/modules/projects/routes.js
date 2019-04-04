const express = require('express')
const router = express.Router()
const controller = require('./controller')

// router.get('/All', async (req, res) => {
//   const data = await controller.getAllProjects()
//   res.send(data)
// })

router.get('/', async (req, res) => {
  if (req.query.project_id) {
    const id = req.query.project_id
    const data = await controller.getProjectsDetailById(id)
    res.send(data)
  }

  if (req.query.student_id) {
    const id = req.query.student_id
    const data = await controller.getProjectsByStudentId(id)
    res.send(data)
  }
})

router.post('/external', async (req, res) => {
  const data = await controller.createProject(req.body)
  res.send(data)
})

router.patch('/:id', async (req, res) => {
  // const id = req.params.id
  console.log(req)
  // controller.updateProjectDetail(id, req.body)
})

router.patch('/counting', async (req, res) => {
  controller.updateProjectCount(req.body.action, req.body.project_id)
})

router.delete('/:id', async (req, res) => {
  const id = req.params.id
  controller.deleteProject(id)
  res.status(200).send({
    status: 200,
    message: 'Delete Success'
  })
})
module.exports = router
