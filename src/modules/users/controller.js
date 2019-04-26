/* eslint-disable camelcase */
const userModel = require('./model')
const projectController = require('../projects/controller')
const { validate } = require('../validation')
const { getUserIdSchema, getListStudentSchema } = require('./json_schema')

module.exports = {

  getUserById: async (req, res) => {
    try {
      const { checkStatus, err } = validate(req.body, getUserIdSchema)
      if (!checkStatus) return res.send(err)

      const { user_role, id } = req.body
      const userData = await userModel.getUserById(user_role, id)
      if (user_role === 'student') {
        const project = await projectController.getProjectsByStudentId(id)
        const totalProject = await projectController.getAmountProjectUser(id)
        userData.total_projects = totalProject
        userData.projects = project
      }
      res.send(userData)
    } catch (err) {
      console.log('hi', err)
      res.status(500).send({
        status: 500,
        message: err.message
      })
    }
  },

  getListStudent: async (req, res) => {
    try {
      const { checkStatus, err } = validate(req.params, getListStudentSchema)
      if (!checkStatus) return res.send(err)

      const code = req.params.code
      const list = await userModel.getListStudent(code)
      res.send(list)
    } catch (err) {
      res.status(500).send({
        status: 500,
        message: err.message
      })
    }
  }
}
