/* eslint-disable camelcase */
const _ = require('lodash')
const moment = require('moment')
const assignmentModel = require('./model')
const courseController = require('../course/controller')
const projectModel = require('../projects/model')
const notiController = require('../notification/controller')
const { validate } = require('../validation')
const { createAssignmentSchema, getAssignmentsDetailByIdSchema, updateProjectStatusSchema, getListAssignmentSpecifyCourseSchema, updateLecturerApproverSchema, joinAssignmentSchema, getAssignmentProjectByStudentIdSchema, getProjectRequestSchema } = require('./json_schema')
const randomstring = require('randomstring')

module.exports = {
  createAssignment: async (req, res, next) => {
    const { checkStatus, err } = validate(req.body, createAssignmentSchema)
    if (!checkStatus) return res.send(err)

    try {
      const { auth } = req
      const { academic_term_id, course_id, assignment_name, assignment_detail } = req.body
      const courseSemesters = await courseController.getCourseSpecifySemester(academic_term_id, course_id)
      let code = ''
      while (true) {
        code = randomstring.generate({
          length: 6,
          charset: 'alphanumeric',
          capitalization: 'uppercase'
        })
        const exist = await assignmentModel.checkJoinCode(code)
        if (!exist) {
          break
        }
      }
      const assignment = {
        assignment_name: assignment_name,
        assignment_detail: assignment_detail || null,
        join_code: code
      }
      const assignmentId = await assignmentModel.createAssignment(assignment)
      const mapCourseAssignment = async _ => {
        const promises = courseSemesters.map(async courseSemester => {
          const isCreator = courseSemester.lecturer_id === auth.uid
          const isApprover = courseSemester.lecturer_id === auth.uid
          await assignmentModel.mapLecturerAssignment(courseSemester.lecturer_course_id, assignmentId, isCreator, isApprover)
        })
        await Promise.all(promises)
      }
      await mapCourseAssignment()
      res.status(200).send({
        status: 200,
        message: 'Create Assignment Success'
      })
    } catch (err) {
      res.status(500).send({
        status: 500,
        message: err.message
      })
    }
  },

  getStudentAssignments: async (req, res, next) => {
    try {
      const { auth } = req
      if (auth.role !== 'student') { res.status(403).send({ auth: false, message: 'Permission Denied' }) }
      const assignments = await assignmentModel.getStudentAssignments(auth.uid)
      res.send(assignments)
    } catch (err) {
      res.status(500).send({
        status: 500,
        message: err.message
      })
    }
  },

  getListAssignmentSpecifyCourse: async (req, res, next) => {
    const { checkStatus, err } = validate(req.query, getListAssignmentSpecifyCourseSchema)
    if (!checkStatus) return res.send(err)

    try {
      const { auth } = req
      const { course_id } = req.query
      if (auth.role !== 'lecturer') { res.status(403).send({ auth: false, message: 'Permission Denied' }) }

      const assignments = await assignmentModel.getListAssignmentSpecifyCourse(course_id)
      assignments.map(assignment => {
        assignment.isCreator = assignment.isCreator === 1
        assignment.isApprover = assignment.isApprover === 1
      })

      const countProjectAndStudent = async _ => {
        const promises = assignments.map(async assignment => {
          const count = await assignmentModel.countProjectAndStudent(assignment.assignment_id)
          assignment.count = count
        })
        await Promise.all(promises)
      }
      await countProjectAndStudent()

      res.send(assignments)
    } catch (err) {
      res.status(500).send({
        status: 500,
        message: err.message
      })
    }
  },

  getAssignmentsDetailById: async (req, res, next) => {
    const { checkStatus, err } = validate(req.params, getAssignmentsDetailByIdSchema)
    if (!checkStatus) return res.send(err)

    try {
      const { assignment_id } = req.params
      const assignment = await assignmentModel.getAssignmentsDetailById(assignment_id)
      assignment.created_at = moment(assignment.created_at).format('LLL')
      assignment.updated_at = moment(assignment.updated_a).format('LLL')
      assignment.lecturers = await modifyLecturerMember(assignment.lecturer_course_id, assignment.lecturers_id, assignment.lecturers_name, assignment.isCreator, assignment.isApprover)
      assignment.students = await modifyStudentMember(assignment.students_id, assignment.students_name)
      delete assignment.lecturer_course_id
      delete assignment.lecturers_id
      delete assignment.lecturers_name
      delete assignment.isCreator
      delete assignment.isApprover
      delete assignment.students_id
      delete assignment.students_name
      res.send(assignment)
    } catch (err) {
      res.status(500).send({
        status: 500,
        message: err.message
      })
    }
  },

  updateLecturerApprove: async (req, res, next) => {
    const { checkStatus, err } = validate(req.body, updateLecturerApproverSchema)
    if (!checkStatus) return res.send(err)

    try {
      const { assignment_id, lecturer_course_id, isApprove } = req.body
      const lecturer = await assignmentModel.updateLecturerApprove(assignment_id, lecturer_course_id, isApprove)
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

  joinAssignment: async (req, res, next) => {
    const { checkStatus, err } = validate(req.query, joinAssignmentSchema)
    if (!checkStatus) return res.send(err)

    try {
      const { auth } = req
      if (auth.role !== 'student') { res.status(403).send({ auth: false, message: 'Permission Denied' }) }
      const { join_code } = req.query
      const message = await assignmentModel.joinAssignment(join_code, auth.uid)
      res.send(message)
    } catch (err) {
      res.status(500).send({
        status: 500,
        message: err.message
      })
    }
  },

  getAssignmentProjectByStudentId: async (req, res, next) => {
    const { checkStatus, err } = validate(req.query, getAssignmentProjectByStudentIdSchema)
    if (!checkStatus) return res.send(err)

    try {
      const { auth } = req
      if (auth.role !== 'student') { res.status(403).send({ auth: false, message: 'Permission Denied' }) }
      const { isHave } = req.query
      const assignments = await assignmentModel.getAssignmentIsHaveProjectByStudentId(isHave, auth.uid)
      res.send(assignments)
    } catch (err) {
      res.status(500).send({
        status: 500,
        message: err.message
      })
    }
  },

  getProjectRequest: async (req, res, next) => {
    const { checkStatus, err } = validate(req.query, getProjectRequestSchema)
    if (!checkStatus) return res.send(err)

    try {
      const { auth } = req
      if (auth.role !== 'lecturer') { res.status(403).send({ auth: false, message: 'Permission Denied' }) }
      const { assignment_id, status } = req.query || undefined
      const projects = await assignmentModel.getProjectInAssignment(assignment_id, status)
      res.send(projects)
    } catch (err) {
      res.status(500).send({
        status: 500,
        message: err.message
      })
    }
  },

  updateProjectStatus: async (req, res, next) => {
    const { checkStatus, err } = validate(req.query, updateProjectStatusSchema)
    if (!checkStatus) return res.send(err)

    try {
      const { auth } = req
      if (auth.role !== 'lecturer') { res.status(403).send({ auth: false, message: 'Permission Denied' }) }
      const { assignment_id, project_Id, status, comment } = req.query || undefined
      const projects = await assignmentModel.updateProjectStatus(assignment_id, project_Id, status, comment)

      let assignment = null
      assignment = assignmentModel.getAssignmentsDetailById(assignment_id)
      delete assignment.lecturers
      delete assignment.students

      const page = await projectModel.getShortProjectDetailById(project_Id)
      let projectAssignmentStatus = page.project_detail.status_name || null
      await notiController.sendEmail(project_Id, auth.fullname, page, 'check', assignment, projectAssignmentStatus)

      res.status(200).send({
        status: 200,
        message: `Updated ${project_Id} success.`
      })
    } catch (err) {
      res.status(500).send({
        status: 500,
        message: err.message
      })
    }
  }
}

async function modifyLecturerMember (lecturerCourseId, lecturersId, lecturersName, isCreator, isApprover) {
  const lecturers = []
  lecturerCourseId = _.split(lecturerCourseId, ',')
  lecturersId = _.split(lecturersId, ',')
  lecturersName = _.split(lecturersName, ',')
  isCreator = _.split(isCreator, ',')
  isApprover = _.split(isApprover, ',')

  for (let i = 0; i < lecturerCourseId.length; i++) {
    lecturers.push({
      lecturer_course_id: lecturerCourseId[i],
      lecturer_id: lecturersId[i],
      lecturer_name: lecturersName[i],
      isCreator: isCreator[i] === '1',
      isApprover: isApprover[i] === '1'
    })
  }
  return lecturers
}

async function modifyStudentMember (studentsId, studentsName) {
  const students = []
  studentsId = _.split(studentsId, ',')
  studentsName = _.split(studentsName, ',')
  for (let i = 0; i < studentsId.length; i++) {
    students.push({
      student_id: studentsId[i],
      student_name: studentsName[i]
    })
  }
  return students
}
