const moment = require('moment')
const _ = require('lodash')
const projectModel = require('./model')
const authenController = require('../authentication/controller')
const userController = require('../users/controller')
const tagsController = require('../tags/controller')
const filesController = require('../files/controller')
const notiController = require('../notification/controller')

const { validate } = require('../validation')
const { pageDefaultSchema, projectPageSchema, createProjectSchema, updateProjectDetailSchema, updateClapSchema } = require('./json_schema')

module.exports = {

  getAllProjects: async (req, res) => {
    try {
      let result = {}
      const { checkStatus, err } = validate(req.params, pageDefaultSchema)
      if (!checkStatus) return res.send(err)
      const { page, year } = req.params
      if (page === 'all') {
        const years = await projectModel.getAllYearProject(year)
        if (year === 'present') {
          result.years = years
        }
        const getYear = year === 'present' ? years[0].year : year
        result.projects = await projectModel.getAllProjects(getYear)
        res.send(result)
      }
    } catch (err) {
      console.log(err)
    }
  },

  getProjectPage: async (req, res) => {
    const { checkStatus, err } = validate(req.query, projectPageSchema)
    if (!checkStatus) return res.send(err)

    try {
      const auth = req.headers.authorization ? await authenController.authorization(req.headers.authorization) : null
      const projectId = req.query.project_id
      const page = await getProjectDetail(projectId)
      page.access = false
      if (auth != null) {
        const access = !!_.find(page.students, { 'student_id': auth.uid })
        page.access = access
      }
      if (!page.access) {
        await projectModel.updateProjectCouting('viewer', projectId)
        page.project_detail.count_viewer++
      }
      res.send(page)
    } catch (err) {
      res.status(500).send({
        status: 500,
        message: err.message
      })
    }
  },

  createProject: async (req, res, next) => {
    const { checkStatus, err } = validate(req.body, createProjectSchema)
    if (!checkStatus) return res.send(err)

    try {
      const { auth } = req
      // eslint-disable-next-line camelcase
      const { project_data, member, achievements } = req.body
      project_data.start_year_th = project_data.start_year_en + 543
      project_data.end_year_th = project_data.end_year_en + 543
      const projectId = await projectModel.createProject(project_data)
      if (auth && member.students.length >= 0) {
        const students = member.students || []
        students.push({
          student_id: auth.uid
        })
        students.forEach((student) => {
          student.project_id = projectId
        })
        await projectModel.addProjectStudent(students)
      }

      if (project_data.haveOutsider && member.outsiders !== undefined && member.outsiders.length > 0) {
        await manageOutsider(member.outsiders, projectId)
      }

      if (achievements !== undefined) {
        await manageAchievement(projectId, achievements)
      }
      const page = await getProjectDetail(projectId)
      await notiController.sendEmail(auth.fullname, page, 'create')
      res.status(200).send({
        status: 200,
        project_id: projectId
      })
    } catch (err) {
      res.status(500).send({
        status: 500,
        message: err.message
      })
    }
  },

  updateProjectDetail: async (req, res, next) => {
    const { checkStatus, err } = validate(req.body, updateProjectDetailSchema)
    if (!checkStatus) return res.send(err)

    try {
      const { auth } = req
      // eslint-disable-next-line camelcase
      const { project_detail, outsiders, achievements, tags, video } = req.body
      const id = project_detail.id
      await projectModel.updateProjectDetail(id, project_detail)

      await manageAchievement(id, achievements)
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
      const newDetail = await getProjectDetail(id)
      notiController.sendEmail(auth.fullname, newDetail, 'Update')

      res.send(newDetail)
    } catch (err) {
      res.status(500).send({
        status: 500,
        message: err.message
      })
    }
  },

  updateProjectClap: async (req, res) => {
    const { checkStatus, err } = validate(req.body, updateClapSchema)
    if (!checkStatus) return res.send(err)

    try {
      const projectId = req.body.project_id
      const result = await projectModel.updateProjectCouting('clap', projectId)
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
      const projectId = req.params.id
      await projectModel.deleteProject(projectId)
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
      const outsiders = await userController.getOutsider(projectId)
      result.outsiders = outsiders[0] === undefined ? [] : outsiders
    }
    if (result.project_detail.references) {
      const ref = result.project_detail.references
      result.project_detail.references = _.split(ref, ',')
    }
    if (result.achievements.length > 0) {
      result.achievements.forEach(achievement => {
        achievement.date_of_event = achievement.date_of_event === '0000-00-00' ? null : moment(achievement.date_of_event).format('DD-MM-YYYY')
      })
    }

    result.project_detail.created_at = moment(result.project_detail.created_at).format('LLL')
    result.project_detail.updated_at = moment(result.project_detail.updated_at).format('LLL')

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
      await userController.createOutsider(outsiderNotId)
    }

    const outsiderHaveId = await outsiders.filter(outsider => outsider.id !== undefined)
    if (outsiderHaveId.length > 0) {
      await userController.updateOutsider(outsiderHaveId)
    }
  } catch (err) {
    throw new Error(err)
  }
}

async function manageAchievement (id, achievements) {
  try {
    if (achievements.length > 0) {
      achievements.forEach(achievement => {
        achievements.project_id = id
        const date = achievement.date_of_event
        achievement.date_of_event = moment(date, 'DD-MM-YYYY').format('YYYY-MM-DD')
      })
      await projectModel.manageProjectAchievement(id, achievements)
    }
  } catch (err) {
    throw new Error(err)
  }
}
exports.getProjectsByStudentId = async function (access, userId) {
  try {
    let result = await projectModel.getProjectsByStudentId(access, userId)
    return result
  } catch (err) {
    throw new Error(err)
  }
}

exports.getAmountProjectUser = async function (userId) {
  try {
    const result = await projectModel.countProjectByYear(userId)
    return result
  } catch (err) {
    throw new Error(err)
  }
}

exports.getAmountProjectTag = async function (projects) {
  try {
    let allProjectId = []
    projects.forEach(project => {
      allProjectId.push(project.id)
    })
    const result = await projectModel.countTagForAllProject(allProjectId)
    return result
  } catch (err) {
    throw new Error(err)
  }
}
