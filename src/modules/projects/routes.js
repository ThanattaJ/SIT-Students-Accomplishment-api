const express = require('express')
const router = express.Router()
const controller = require('./controller')

router.get('/:id', async (req, res) => {
  const id = req.params.id
  const data = await controller.getProjectPage(id)
  res.send(data)
})

router.post('/external', async (req, res) => {
  const data = await controller.createProject(req.body)
  res.send(data)
})

router.patch('/:id', controller.updateProjectDetail)

router.patch('/counting', controller.updateProjectCount)

router.delete('/:id', async (req, res) => {
  const id = req.params.id
  try {
    await controller.deleteProject(id)
    res.status(200).send({
      status: 200,
      message: 'Delete Success'
    })
  } catch (err) {
    res.status(500).send({
      status: 500,
      message: err
    })
  }
})
module.exports = router
