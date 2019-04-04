const moment = require('moment')
const _ = require('lodash')
const projectModel = require('./model')
const outsidersController = require('../outsiders/controller')
const filesController = require('../files/controller')
module.exports = {

  getAllProjects: async () => {
    const result = await projectModel.getAllProjects()
    return result
  },

  getProjectsByStudentId: async (userId) => {
    const result = await projectModel.getProjectsByStudentId(userId)
    return result
  },

  getProjectsDetailById: async (projectId) => {
    const result = await projectModel.getProjectsDetailById(projectId)
    console.log(result.project_detail)
    if (result.project_detail.references) {
      const ref = result.project_detail.references
      result.project_detail.references = _.split(ref, ',')
    }
    return result
  },

  createProject: async (data) => {
    const project = await projectModel.createProject(data.project_data)
    let result = { project: project }

    if (data.member.students !== undefined) {
      const students = data.member.students
      students.forEach((student) => {
        student.project_id = project.id
      })
      const memberStudent = await projectModel.addProjectStudent(students)
      result.member = { students: memberStudent }
    }

    if (data.project_data.haveOutsider === true) {
      const outsiders = data.member.outsiders
      outsiders.forEach((outsider) => {
        outsider.project_id = project.id
      })
      const membersOutsiders = await outsidersController.createOutsider(outsiders)
      result.member.outsiders = membersOutsiders
    }

    if (data.achievement !== undefined) {
      const achieveData = data.achievement
      achieveData.date_of_event = moment(achieveData.date_of_event, 'DD-MM-YYYY').format('YYYY-MM-DD')
      achieveData.project_id = project.id
      const achievement = await projectModel.addProjectAchievement(achieveData)
      result.achievement = achievement
    }

    return result
  },
  updateProjectDetail: async () => {
    filesController.test()
  },

  updateProjectCount: async (action, projectId) => {
    const result = await projectModel.updateProjectCount(action, projectId)
    return result
  },

  deleteProject: async (id) => { await projectModel.deleteProject(id) }
}
