const userModel = require('./model')
const projectController = require('../projects/controller')
module.exports = {

  getuUserById: async (data) => {
    const userData = await userModel.getUserById(data.user_role, data.student_id)
    const project = await projectController.getProjectsByStudentId(data.student_id)
    const totalProject = await userModel.countProjectUser(data.student_id)
    userData.total_projects = totalProject
    userData.projects = project
    return userData
  }
}
