/* eslint-disable camelcase */
const userModel = require('./model')
const moment = require('moment')
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
      userData.profile.birthday = moment(userData.profile.birthday).format('DD-MM-YYYY')
      if (user_role === 'student') {
        const project = await projectController.getProjectsByStudentId(id)
        const totalProject = await projectController.getAmountProjectUser(id)
        userData.total_projects = totalProject
        userData.projects = project
      }
      res.send(userData)
    } catch (err) {
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
  },

  createOutsider: async (data) => {
    try {
      const result = await userModel.addProjectOutsider(data)
      return result
    } catch (err) {
      throw new Error(err)
    }
  },

  getOutsider: async (projectId) => {
    try {
      const outsiders = await userModel.getProjectOutsider(projectId)
      return outsiders
    } catch (err) {
      throw new Error(err)
    }
  },

  updateOutsider: async (outsiders) => {
    try {
      outsiders.forEach(async outsider => {
        await userModel.updateProjectOutsider(outsider)
      })
    } catch (err) {
      throw new Error(err)
    }
  },

  deleteOutsider: async (req, res) => {
    const id = req.params.id
    const { checkStatus, err } = validate(req.params, userModel)
    if (!checkStatus) return res.send(err)

    try {
      await userModel.deleteOutsider(id)
      res.status(200).send({
        status: 200,
        message: 'Delete Success'
      })
    } catch (err) {
      res.status(500).send({
        status: 500,
        message: err.message
      })
    }
  }

}
