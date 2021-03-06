/* eslint-disable camelcase */
const userModel = require('./model')
const moment = require('moment')
const projectModel = require('../projects/model')
const fileController = require('../files/controller')
const authenController = require('../authentication/controller')
const courseController = require('../course/controller')
const { validate } = require('../validation')
const json = require('./json_schema')

module.exports = {

  getUserDefaultInformation: async (req, res) => {
    try {
      const auth = req.headers.authorization && req.headers.authorization !== 'null' ? await authenController.authorization(req.headers.authorization) : null
      let userData = {}
      let userRole
      if (auth === null) {
        const { checkStatus, err } = validate(req.query, json.getUserIdSchema)
        if (!checkStatus) return res.send(err)
        userRole = req.query.user_role
        const userId = req.query.user_id
        userData = await userModel.getUserDefaultInformation(userRole, userId)
        userData.access = false
      } else if (auth !== null) {
        userRole = req.query.user_role || null
        const userId = req.query.user_id || null
        if ((userId !== null && userId !== auth.uid) && userRole !== null) {
          userData = await userModel.getUserDefaultInformation(userRole, userId)
          userData.access = false
        } else {
          userRole = auth.role
          userData = await userModel.getUserDefaultInformation(userRole, auth.uid)
          userData.access = true
        }
      }
      if (userRole === 'student') {
        const project = await getProjectByStudentId(userData.access, userData.profile.student_id)
        userData.projects = project.project
        userData.totalProject = project.totalProject
        userData.allTag = project.allTag
      } else if (userRole === 'lecturer') {
        const courses = await courseController.getCourseLecturer(userData.profile.lecturer_id)
        userData.courses = courses
      }
      if (!userData.access) {
        await userModel.updateProfileCounting('viewer', userData.profile.student_id)
        userData.profile.viewer++
      }
      res.send(userData)
    } catch (err) {
      res.status(500).send({
        status: 500,
        message: err.message
      })
    }
  },

  getUserProjectFilterTag: async (req, res) => {
    try {
      const { checkStatus, err } = validate(req.query, json.getUserProjectFilterTag)
      if (!checkStatus) return res.send(err)
      const userId = req.query.user_id
      const { tag } = req.query
      const projects = await getProjectFilterTagByStudentId(userId, tag)
      res.send(projects)
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
      const { method } = req.body
      if (file === undefined) {
        return res.status(500).send({
          status: 500,
          message: 'Dose Not Exsit File'
        })
      }
      const { auth } = req
      const imageOldLink = await userModel.getUserImage(auth.role, auth.uid, method)
      if (imageOldLink !== null) {
        await fileController.deleteObjectStorage(imageOldLink, 'image')
      }
      let isProfile
      let isResume
      if (method === 'profile') {
        isProfile = true
        isResume = false
      } else {
        isProfile = false
        isResume = true
      }
      const link = await fileController.uploadFileToStorage(file, 'image', auth.uid, isProfile, isResume)
      const result = await userModel.updateUserImage(auth.role, auth.uid, link, method) === 1 ? 'Update Success' : 'Updatee Fail'
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
      const access = auth.uid === req.params.id
      if (access === false) {
        res.status(403).send({
          status: 403,
          message: 'Permission Denied'
        })
      } else {
        const userData = await userModel.getStudentInformationById(auth.uid)
        userData.profile.birthday = userData.profile.birthday === '0000-00-00' ? null : moment(userData.profile.birthday).format('DD-MM-YYYY')
        const project = await getProjectByStudentId(access, auth.uid)
        userData.projects = project.project

        res.send(userData)
      }
    } catch (err) {
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
      const date = profile.birthday
      profile.birthday = moment(date, 'DD-MM-YYYY').format('YYYY-MM-DD')
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
      await userModel.deleteUserProfileInformation('student_language', profileId[0].id)
      if (languages.length > 0) {
        languages.forEach(async language => {
          delete language.language_name
          delete language.levelname
          language.students_profile_id = profileId[0].id
        })
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
      await userModel.deleteUserProfileInformation('student_education', profileId[0].id)
      if (educations.length > 0) {
        educations.forEach(education => {
          delete education.level_name
          education.students_profile_id = profileId[0].id
        })
        await userModel.addUserEducation(educations)
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

      await userModel.deleteUserProfileInformation('students_skill', profileId[0].id)
      if (skills.length > 0) {
        skills.forEach(async skill => {
          delete skill.level_name
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
      const profileId = await userModel.getProfileId(auth.uid)
      await userModel.updateUserSocial(profileId[0].id, social)
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

  updateResemeCounting: async (req, res) => {
    try {
      const { auth } = req
      await userModel.updateProfileCounting('resume_gen_count', auth.uid)
      res.status(200).send({
        status: 200,
        message: 'Count Success'
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
      const list = await userModel.getListStudent(code, true)
      res.send(list)
    } catch (err) {
      res.status(500).send({
        status: 500,
        message: err.message
      })
    }
  },

  getListLecturer: async (req, res) => {
    const { checkStatus, err } = validate(req.query, json.getListLecturerSchema)
    if (!checkStatus) return res.send(err)
    try {
      const academicTermId = req.query.academic_term_id || undefined
      const courseId = req.query.courses_id || undefined
      let list
      if (academicTermId !== undefined && courseId !== undefined) {
        list = await userModel.getListLecturer(academicTermId, courseId)
      } else {
        list = await userModel.getListLecturer()
      }
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

async function getProjectByStudentId (access, userId) {
  const result = {}
  result.project = await projectModel.getProjectsByStudentId(access, userId)
  result.totalProject = await projectModel.countProjectByYear(userId)
  const projects = result.project
  let allProjectId = []
  projects.forEach(project => {
    allProjectId.push(project.id)
  })
  result.allTag = await projectModel.countTagForAllProject(allProjectId)

  return result
}

async function getProjectFilterTagByStudentId (userId, tag) {
  const projects = await projectModel.getProjectFilterTagByStudentId(userId, tag)
  return projects
}
