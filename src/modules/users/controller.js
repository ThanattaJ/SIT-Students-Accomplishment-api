/* eslint-disable camelcase */
const userModel = require('./model')
const moment = require('moment')
const projectController = require('../projects/controller')
const fileController = require('../files/controller')
const authenController = require('../authentication/controller')
const { validate } = require('../validation')
const json = require('./json_schema')

module.exports = {

  getUserDefaultInformation: async (req, res) => {
    try {
      const auth = req.headers.authorization ? await authenController.authorization(req.headers.authorization) : null
      let userData = {}
      let userRole
      if (auth === null) {
        const { checkStatus, err } = validate(req.query, json.getUserIdSchema)
        if (!checkStatus) return res.send(err)
        userRole = req.query.user_role
        const { id } = req.query
        userData = await userModel.getUserDefaultInformation(userRole, id)
      } else {
        userRole = auth.role
        userData = await userModel.getUserDefaultInformation(userRole, auth.uid)
        userData.access = true
      }
      if (userRole === 'student') {
        const project = await getProjectByStudentId(userData.profile.student_id)
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

  updateUserEmail: async (req, res, next) => {
    try {
      const { checkStatus, err } = validate(req.body, json.updateUserEmailSchema)
      if (!checkStatus) return res.send(err)
      const { auth } = req
      const { email } = req.body
      const result = await userModel.updateUserEmail(auth.role, auth.uid, email) === 1 ? 'Update Success' : 'Updatee Fail'
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

  updateUserImage: async (req, res, next) => {
    try {
      const { file } = req
      if (file === undefined) {
        return res.status(500).send({
          status: 500,
          message: 'Dose Not Exsit File'
        })
      }
      const { auth } = req
      const imageOldLink = await userModel.getUserImage(auth.role, auth.uid)
      if (imageOldLink !== null) {
        await fileController.deleteObjectStorage(imageOldLink, 'image')
      }
      const link = await fileController.uploadFileToStorage(file, 'image', auth.uid, true)
      const result = await userModel.updateUserImage(auth.role, auth.uid, link) === 1 ? 'Update Success' : 'Updatee Fail'
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

  getStudentInformation: async (req, res, next) => {
    try {
      const { checkStatus, err } = validate(req.params, json.getStudentIdSchema)
      if (!checkStatus) return res.send(err)

      const { auth } = req

      const userData = await userModel.getStudentInformationById(auth.uid)
      userData.profile.birthday = userData.profile.birthday === '0000-00-00' ? null : moment(userData.profile.birthday).format('YYYY-MM-DD')
      const project = await getProjectByStudentId(auth.uid)
      userData.projects = project.project

      res.send(userData)
    } catch (err) {
      console.log('err', err)
      res.status(500).send({
        status: 500,
        message: err.message
      })
    }
  },

  updateStudentInformation: async (req, res, next) => {
    const { checkStatus, err } = validate(req.body, json.updateStudentIdSchema)
    if (!checkStatus) return res.send(err)
    try {
      const { auth } = req
      if (!checkStatus) return res.send(err)
      const { profile, address } = req.body
      await userModel.updateStudentInformation(auth.uid, profile, address)
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

  updateStudentLanguage: async (req, res, next) => {
    const { checkStatus, err } = validate(req.body, json.updateStudentLanguageSchema)
    if (!checkStatus) return res.send(err)
    try {
      const { auth } = req
      const { languages } = req.body
      const profileId = await userModel.getProfileId(auth.uid)
      if (languages.length > 0) {
        console.log(languages)
        await userModel.deleteUserLanguage(profileId[0].id)
        languages.forEach(async language => {
          language.students_profile_id = profileId[0].id
        })
        console.log(languages)
        await userModel.addUserLanguage(languages)
      }
      res.status(200).send({
        status: 200,
        message: 'Update Language'
      })
    } catch (err) {
      res.status(500).send({
        status: 500,
        message: err.message
      })
    }
  },

  updateStudentEducation: async (req, res, next) => {
    const { checkStatus, err } = validate(req.body, json.updateStudentEducationSchema)
    if (!checkStatus) return res.send(err)
    try {
      const { auth } = req
      const { educations } = req.body
      const profileId = await userModel.getProfileId(auth.uid)
      if (educations.length > 0) {
        const educationNotId = await educations.filter(education => education.id === undefined)
        if (educationNotId.length > 0) {
          educationNotId.forEach(education => {
            delete education.level_name
            education.students_profile_id = profileId[0].id
          })
          await userModel.addUserEducation(educationNotId)
        }

        const educationHaveId = await educations.filter(education => education.id !== undefined)
        if (educationHaveId.length > 0) {
          educationHaveId.forEach(async education => {
            delete education.level_name
            await userModel.updateUserEducation(education)
          })
        }
      }
      res.status(200).send({
        status: 200,
        message: 'Update Education'
      })
    } catch (err) {
      res.status(500).send({
        status: 500,
        message: err.message
      })
    }
  },

  updateStudentSkill: async (req, res, next) => {
    const { checkStatus, err } = validate(req.body, json.updateStudentSkillSchema)
    if (!checkStatus) return res.send(err)
    try {
      const { auth } = req
      const { skills } = req.body
      const profileId = await userModel.getProfileId(auth.uid)

      if (skills.length > 0) {
        console.log(skills)
        await userModel.deleteUserSkill(profileId[0].id)
        skills.forEach(async skill => {
          skill.students_profile_id = profileId[0].id
        })
        await userModel.addUserSkill(skills)
      }
      res.status(200).send({
        status: 200,
        message: 'Update Skill'
      })
    } catch (err) {
      res.status(500).send({
        status: 500,
        message: err.message
      })
    }
  },

  updateStudentSocial: async (req, res, next) => {
    const { checkStatus, err } = validate(req.body, json.updateStudentSocialSchema)
    if (!checkStatus) return res.send(err)
    try {
      const { auth } = req
      const { social } = req.body
      await userModel.updateUserSocial(auth.uid, social)
      res.status(200).send({
        status: 200,
        message: 'Update Social'
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
      const { checkStatus, err } = validate(req.params, json.getListStudentSchema)
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

  getListLecturer: async (req, res) => {
    try {
      const list = await userModel.getListLecturer()
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

  getSkillLevel: async (req, res) => {
    try {
      const list = await userModel.getSkillLevel()
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
