/* eslint-disable camelcase */
const userModel = require('./model')
const moment = require('moment')
const projectController = require('../projects/controller')
const fileController = require('../files/controller')
const { validate } = require('../validation')
const { getUserIdSchema, getListStudentSchema, updateUserEmailSchema, updateUserImageSchema, updateStudentIdSchema, getStudentIdSchema } = require('./json_schema')

module.exports = {

  getUserDefaultInformation: async (req, res) => {
    try {
      const { checkStatus, err } = validate(req.query, getUserIdSchema)
      if (!checkStatus) return res.send(err)
      const { user_role, id } = req.query
      const userData = await userModel.getUserDefaultInformation(user_role, id)
      if (user_role === 'student') {
        const project = await getProjectByStudentId(id)
        userData.projects = project.project
        userData.totalProject = project.totalProject
      }
      res.send(userData)
    } catch (err) {
      res.status(500).send({
        status: 500,
        message: err.message
      })
    }
  },

  updateUserEmail: async (req, res) => {
    try {
      const { checkStatus, err } = validate(req.body, updateUserEmailSchema)
      if (!checkStatus) return res.send(err)

      const { user_role, id, email } = req.body
      const result = await userModel.updateUserEmail(user_role, id, email) === 1 ? 'Update Success' : 'Updatee Fail'
      res.status(200).send({
        status: 200,
        message: result
      })
    } catch (err) {
      res.status(500).send({
        status: 500,
        message: err.message
      })
    }
  },

  updateUserImage: async (req, res) => {
    const { checkStatus, err } = validate(req.body, updateUserImageSchema)
    if (!checkStatus) return res.send(err)
    try {
      const { file } = req
      if (file === undefined) {
        return res.status(500).send({
          status: 500,
          message: 'Dose Not Exsit File'
        })
      }
      const { user_role, id } = req.body
      const imageOldLink = await userModel.getUserImage(user_role, id)
      if (imageOldLink !== null) {
        await fileController.deleteObjectStorage(imageOldLink, 'image')
      }
      const link = await fileController.uploadFileToStorage(file, 'image', id, true)
      const result = await userModel.updateUserImage(user_role, id, link) === 1 ? 'Update Success' : 'Updatee Fail'
      res.status(200).send({
        status: 200,
        message: result
      })
    } catch (err) {
      res.status(500).send({
        status: 500,
        message: err.message
      })
    }
  },

  getStudentInformation: async (req, res) => {
    try {
      const { checkStatus, err } = validate(req.params, getStudentIdSchema)
      if (!checkStatus) return res.send(err)

      const { id } = req.params
      const userData = await userModel.getStudentInformationById(id)
      userData.profile.birthday = userData.profile.birthday === null ? null : moment(userData.profile.birthday).format('YYYY-MM-DD')
      const project = await getProjectByStudentId(id)
      userData.projects = project.project

      res.send(userData)
    } catch (err) {
      res.status(500).send({
        status: 500,
        message: err.message
      })
    }
  },

  updateStudentInformation: async (req, res) => {
    const { checkStatus, err } = validate(req.body, updateStudentIdSchema)
    if (!checkStatus) return res.send(err)
    try {
      const { profile, address, languages, educations } = req.body
      const profileId = await userModel.updateStudentInformation(profile, address)

      if (languages.length > 0) {
        console.log(languages)
        await userModel.deleteUserLanguage(profileId)
        languages.forEach(async language => {
          language.students_profile_id = profileId
        })
        await userModel.addUserLanguage(languages)
      }

      if (educations.length > 0) {
        const educationNotId = await educations.filter(education => education.id === undefined)
        if (educationNotId.length > 0) {
          educationNotId.forEach(education => {
            education.students_profile_id = profileId
          })
          await userModel.addUserEducation(educationNotId)
        }

        const educationHaveId = await educations.filter(education => education.id !== undefined)
        if (educationHaveId.length > 0) {
          educationHaveId.forEach(async education => {
            await userModel.updateUserEducation(education)
          })
        }
      }
      res.status(200).send({
        status: 200,
        message: 'Update Success'
      })
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

  getLanguages: async (req, res) => {
    try {
      const list_languages = await userModel.getLanguages()
      const list_level = await userModel.getLanguagesLevel()
      const list = {
        language: list_languages,
        level: list_level
      }
      res.send(list)
    } catch (err) {
      res.status(500).send({
        status: 500,
        message: err.message
      })
    }
  },

  getEducationLevel: async (req, res) => {
    try {
      const list = await userModel.getEducationLevel()
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
    const { checkStatus, err } = validate(req.params, userModel)
    if (!checkStatus) return res.send(err)

    try {
      const id = req.params.outsider_id
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

async function getProjectByStudentId (userId) {
  const result = {}
  result.project = await projectController.getProjectsByStudentId(userId)
  result.totalProject = await projectController.getAmountProjectUser(userId)

  return result
}
