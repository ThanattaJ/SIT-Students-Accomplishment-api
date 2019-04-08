const express = require('express')
const router = express.Router()
const controller = require('./controller')

router.post('/', async (req, res) => {
  const data = await controller.createProject(req.body)
  res.send(data)
})

router.get('/', async (req, res) => {
  const data = await controller.getProjects()
  res.send(data)
})

router.patch('/:id', async (req, res) => {
  const id = req.params.id
  controller.updateProject(id, req.body)
})

router.patch('/countView', async (req, res) => {

})

router.patch('/countClap', async (req, res) => {
})

module.exports = router
