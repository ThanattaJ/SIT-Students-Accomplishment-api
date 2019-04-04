const userModel = require('./model')
const projectController = require('../projects/controller')
module.exports = {

  getuUserById: async (data) => {
    const userData = await userModel.getUserById(data.user_role, data.id)
    const project = await projectController.getProjectsByStudentId(data.id)
    const totalProject = await userModel.countProjectUser(data.id)
    userData.total_projects = totalProject
    userData.projects = project
    return userData
  }
}
