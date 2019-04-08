const moment = require('moment')
const _ = require('lodash')
const projectModel = require('./model')
const outsidersController = require('../outsiders/controller')
const tagController = require('../tags/controller')
module.exports = {

  getAllProjects: async () => {
    const result = await projectModel.getAllProjects()
    return result
  },

  getProjectsByStudentId: async (userId) => {
    const result = await projectModel.getProjectsByStudentId(userId)
    return result
  },

  getAmountProjectUser: async (userId) => {
    const result = await projectModel.countProjectUser(userId)
    return result
  },

  getProjectPage: async (projectId) => {
    const page = await getProjectDetail(projectId)
    return page
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
      console.log(outsiders)
      const membersOutsiders = await outsidersController.createOutsider(outsiders)
      result.member.outsiders = membersOutsiders
    }

    if (data.achievement !== undefined) {
      const achieveData = data.achievement
      achieveData.date_of_event = moment(achieveData.date_of_event).format('YYYY-MM-DD')
      achieveData.project_id = project.id
      const achievement = await projectModel.addProjectAchievement(achieveData)
      achievement.date_of_event = moment(achievement.date_of_event).format('DD-MM-YYYY')
      result.achievement = achievement
    }

    return result
  },

  updateProjectDetail: async (req, res) => {
    const id = req.params.id
    const { tags } = req.body
    const tagNews = await checkTag(tags)
    tagNews.forEach(tagNew => {
      tagNew.project_id = id
    })
    projectModel.updateProjectTag(tagNews, id)

    const page = await getProjectDetail(id)
    res.send(page)
  },

  updateProjectCount: async (req, res) => {
    const { action } = req.body
    const projectId = req.body.project_id
    const result = await projectModel.updateProjectCount(action, projectId)
    res.send(result)
  },

  deleteProject: async (id) => { await projectModel.deleteProject(id) }
}

async function checkTag (tags) {
  const tagIdUndefined = tags.filter(tag => tag.tag_id === undefined)
  const tagId = await tagController.createTag(tagIdUndefined)
  tags.forEach(tag => {
    if (tag.tag_id !== undefined) {
      tagId.push({ tag_id: tag.tag_id })
    }
  })
  return tagId
}

async function getProjectDetail (projectId) {
  const result = await projectModel.getProjectsDetailById(projectId)
  result.project_detail.isShow = result.project_detail.isShow === 1
  result.project_detail.haveOutsider = result.project_detail.haveOutsider === 1
  if (result.project_detail.references) {
    const ref = result.project_detail.references
    result.project_detail.references = _.split(ref, ',')
  }
  return result
}
