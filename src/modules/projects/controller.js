const moment = require('moment')
const _ = require('lodash')
const projectModel = require('./model')
const outsidersController = require('../outsiders/controller')
const tagsController = require('../tags/controller')
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

  getAmountProjectUser: async (userId) => {
    const result = await projectModel.countProjectUser(userId)
    return result
  },

  getProjectPage: async (req, res) => {
    const projectId = req.params.id
    const page = await getProjectDetail(projectId)
    res.send(page)
  },

  createProject: async (req, res) => {
    // eslint-disable-next-line camelcase
    const { project_data, member, achievement } = req.body
    project_data.start_year_th = project_data.start_year_en + 543
    try {
      const project = await projectModel.createProject(project_data)
      let result = { project: project }

      if (member.students !== undefined) {
        const students = member.students
        students.forEach((student) => {
          student.project_id = project.id
        })
        const memberStudent = await projectModel.addProjectStudent(students)
        result.member = { students: memberStudent }
      }

      if (project_data.haveOutsider) {
        const membersOutsiders = await manageOutsider(member.outsiders, project.id)
        result.member.outsiders = membersOutsiders
      }

      if (achievement !== undefined) {
        const date = achievement.date_of_event
        achievement.date_of_event = moment(date, 'DD-MM-YYYY').format('YYYY-MM-DD')
        achievement.project_id = project.id
        const achievements = await projectModel.addProjectAchievement(achievement)
        achievements.date_of_event = moment(achievements.date_of_event).format('DD-MM-YYYY')
        result.achievements = achievements
      }

      res.send(result)
    } catch (err) {
      res.status(500).send({
        status: 500,
        message: err
      })
    }
  },

  updateProjectDetail: async (req, res) => {
    // eslint-disable-next-line camelcase
    const { project_detail, outsiders, achievement, tags, video } = req.body
    const id = project_detail.id
    try {
      await projectModel.updateProject(id, project_detail, achievement)
      if (project_detail.haveOutsider) {
        await manageOutsider(outsiders, id)
      }
      if (tags !== undefined) {
        const tagsCheked = await checkTag(tags)
        tagsCheked.forEach(tag => {
          tag.project_id = id
        })
        await projectModel.updateProjectTag(tagsCheked, id)
      }
      await filesController.updateVideo(video, id)
      const page = await getProjectDetail(id)
      res.send(page)
    } catch (err) {
      res.status(500).send({
        status: 500,
        message: err
      })
    }
  },

  updateProjectCount: async (req, res) => {
    const { action } = req.body
    const projectId = req.body.project_id
    const result = await projectModel.updateProjectCount(action, projectId)
    res.send(result)
  },

  deleteProject: async (req, res) => {
    const id = req.params.id
    try {
      await projectModel.deleteProject(id)
      res.status(200).send({
        status: 500,
        message: 'Delete Success'
      })
    } catch (err) {
      res.status(500).send({
        status: 500,
        message: err
      })
    }
  }
}

async function checkTag (tags) {
  const tagIdUndefined = tags.filter(tag => tag.tag_id === undefined)
  const tagId = await tagsController.createTag(tagIdUndefined)
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
  if (result.project_detail.haveOutsider) {
    const outsiders = await outsidersController.getOutsider(projectId)
    result.outsider = outsiders
  }
  if (result.project_detail.references) {
    const ref = result.project_detail.references
    result.project_detail.references = _.split(ref, ',')
  }
  return result
}

async function manageOutsider (outsiders, projectId) {
  const outsiderNotId = await outsiders.filter(outsider => outsider.id === undefined)
  if (outsiderNotId.length > 0) {
    outsiderNotId.forEach(outsider => {
      outsider.project_id = projectId
    })
    await outsidersController.createOutsider(outsiderNotId)
  }

  const outsiderHaveId = await outsiders.filter(outsider => outsider.id !== undefined)
  if (outsiderHaveId.length > 0) {
    await outsidersController.updateOutsider(outsiderHaveId)
  }

  const membersOutsiders = await outsidersController.getOutsider(projectId)
  return membersOutsiders
}
