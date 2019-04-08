/* eslint-disable camelcase */
const userModel = require('./model')
const projectController = require('../projects/controller')
module.exports = {

  getUserById: async (req, res) => {
    const { user_role, id } = req.body
    const userData = await userModel.getUserById(user_role, id)
    if (user_role === 'student') {
      const project = await projectController.getProjectsByStudentId(id)
      const totalProject = await projectController.getAmountProjectUser(id)
      userData.total_projects = totalProject
      userData.projects = project
    }
    res.send(userData)
  },

  getListStudent: async (req, res) => {
    const code = req.params.code
    const list = await userModel.getListStudent(code)
    res.send(list)
  }
}
