const moment = require('moment')
const _ = require('lodash')
const projectModel = require('./model')
const outsidersController = require('../outsiders/controller')
const tagsController = require('../tags/controller')
const filesController = require('../files/controller')

const { validate } = require('../validation')
const { projectPageSchema, createProjectSchema, updateProjectDetailSchema, updateCountingSchema } = require('./json_schema')

module.exports = {

  getAllProjects: async () => {
    try {
      const result = await projectModel.getAllProjects()
      return result
    } catch (err) {
      console.log(err)
    }
  },

  getProjectsByStudentId: async (userId) => {
    try {
      const result = await projectModel.getProjectsByStudentId(userId)
      return result
    } catch (err) {
      throw new Error(err)
    }
  },

  getAmountProjectUser: async (userId) => {
    try {
      const result = await projectModel.countProjectUser(userId)
      return result
    } catch (err) {
      throw new Error(err)
    }
  },

  getProjectPage: async (req, res) => {
    const { checkStatus, err } = validate(req.params, projectPageSchema)
    if (!checkStatus) return res.send(err)

    try {
      const projectId = req.params.id
      const page = await getProjectDetail(projectId)
      res.send(page)
    } catch (err) {
      res.status(500).send({
        status: 500,
        message: err.message
      })
    }
  },

  createProject: async (req, res) => {
    const { checkStatus, err } = validate(req.body, createProjectSchema)
    if (!checkStatus) return res.send(err)

    // eslint-disable-next-line camelcase
    const { project_data, member, achievement } = req.body
    project_data.start_year_th = project_data.start_year_en + 543
    try {
      const project = await projectModel.createProject(project_data)

      if (member.students !== undefined && member.students.length > 0) {
        const students = member.students
        students.forEach((student) => {
          student.project_id = project.id
        })
        await projectModel.addProjectStudent(students)
      }

      if (project_data.haveOutsider && member.outsiders !== undefined && member.outsiders.length > 0) {
        await manageOutsider(member.outsiders, project.id)
      }

      if (achievement !== undefined) {
        const date = achievement.date_of_event
        achievement.date_of_event = moment(date, 'DD-MM-YYYY').format('YYYY-MM-DD')
        achievement.project_id = project.id
        await projectModel.addProjectAchievement(achievement)
      }
      const result = await getProjectDetail(project.id)
      res.send(result)
    } catch (err) {
      res.status(500).send({
        status: 500,
        message: err.message
      })
    }
  },

  updateProjectDetail: async (req, res) => {
    const { checkStatus, err } = validate(req.body, updateProjectDetailSchema)
    if (!checkStatus) return res.send(err)

    // eslint-disable-next-line camelcase
    const { project_detail, outsiders, achievement, tags, video } = req.body
    const id = project_detail.id
    try {
      await projectModel.updateProjectDetail(id, project_detail)

      if (achievement.length > 0) {
        const date = achievement[0].date_of_event
        achievement[0].date_of_event = moment(date, 'DD-MM-YYYY').format('YYYY-MM-DD')
        await projectModel.updateProjectAchievement(id, achievement[0])
      }
      if (project_detail.haveOutsider && outsiders !== undefined && outsiders.length > 0) {
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
        message: err.message
      })
    }
  },

  updateProjectCount: async (req, res) => {
    const { checkStatus, err } = validate(req.body, updateCountingSchema)
    if (!checkStatus) return res.send(err)

    try {
      const { action } = req.body
      const projectId = req.body.project_id
      const result = await projectModel.updateProjectCount(action, projectId)
      res.send(result)
    } catch (err) {
      res.status(500).send({
        status: 500,
        message: err.message
      })
    }
  },

  deleteProject: async (req, res) => {
    const { checkStatus, err } = validate(req.params, projectPageSchema)
    if (!checkStatus) return res.send(err)

    try {
      const id = req.params.id
      await projectModel.deleteProject(id)
      res.status(200).send({
        status: 500,
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

async function checkTag (tags) {
  try {
    const tagIdUndefined = tags.filter(tag => tag.tag_id === undefined)
    const tagId = await tagsController.createTag(tagIdUndefined)
    tags.forEach(tag => {
      if (tag.tag_id !== undefined) {
        tagId.push({ tag_id: tag.tag_id })
      }
    })
    return tagId
  } catch (err) {
    throw new Error(err)
  }
}

async function getProjectDetail (projectId) {
  try {
    const result = await projectModel.getProjectsDetailById(projectId)
    result.project_detail.isShow = result.project_detail.isShow === 1
    result.project_detail.haveOutsider = result.project_detail.haveOutsider === 1
    if (result.project_detail.haveOutsider) {
      const outsiders = await outsidersController.getOutsider(projectId)
      result.outsiders = outsiders[0] === undefined ? [] : outsiders
    }
    if (result.project_detail.references) {
      const ref = result.project_detail.references
      result.project_detail.references = _.split(ref, ',')
    }
    result.achievement[0].date_of_event = moment(result.achievement[0].date_of_event).format('DD-MM-YYYY')
    return result
  } catch (err) {
    throw new Error(err)
  }
}

async function manageOutsider (outsiders, projectId) {
  try {
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
  } catch (err) {
    throw new Error(err)
  }
}
