const _ = require('lodash')
const assignmentModel = require('./model')
const courseController = require('../course/controller')
const { validate } = require('../validation')
const { createAssignmentSchema, getAssignmentByIdSchema, updateLecturerApproverSchema, joinAssignmentSchema } = require('./json_schema')
const randomstring = require('randomstring')

module.exports = {
  createAssignment: async (req, res, next) => {
    const { checkStatus, err } = validate(req.body, createAssignmentSchema)
    if (!checkStatus) return res.send(err)

    try {
      const { auth } = req
      // eslint-disable-next-line camelcase
      const { academic_term_id, course_id, assignment_name } = req.body
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
  getPersonAssignments: async (req, res, next) => {
    try {
      const { auth } = req
      const assignments = await assignmentModel.getPersonAssignments(auth.role, auth.uid)
      if (auth.role === 'lecturer') {
        assignments.map(assignment => {
          assignment.isCreator = assignment.isCreator === 1
          assignment.isApprover = assignment.isApprover === 1
        })
      }
      res.send(assignments)
    } catch (err) {
      res.status(500).send({
        status: 500,
        message: err.message
      })
    }
  },

  getAssignmentById: async (req, res, next) => {
    const { checkStatus, err } = validate(req.query, getAssignmentByIdSchema)
    if (!checkStatus) return res.send(err)

    try {
      // eslint-disable-next-line camelcase
      const { assignment_id } = req.query
      const assignment = await assignmentModel.getAssignmentsById(assignment_id)

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
      // eslint-disable-next-line camelcase
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
      // eslint-disable-next-line camelcase
      const { join_code } = req.query
      await assignmentModel.joinAssignment(join_code, auth.uid)
      res.status(200).send({
        status: 200,
        message: 'Join Success'
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
      lecturer_id: studentsId[i],
      lecturer_name: studentsName[i]
    })
  }
  return students
}
