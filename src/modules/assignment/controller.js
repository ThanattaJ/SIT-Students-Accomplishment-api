const _ = require('lodash')
const assignmentModel = require('./model')
const courseController = require('../course/controller')
const { validate } = require('../validation')
const { queryCreateAssignmentSchema, queryGetAssignmentByIdSchema, queryUpdateLecturerApproverSchema } = require('./json_schema')
const randomstring = require('randomstring')

module.exports = {
  createAssignment: async (req, res, next) => {
    const { checkStatus, err } = validate(req.body, queryCreateAssignmentSchema)
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
  getAllLecturerAssignments: async (req, res, next) => {
    try {
      const { auth } = req
      const assignments = await assignmentModel.getAllLecturerAssignments(auth.uid)
      assignments.map(assignment => {
        assignment.isCreator = assignment.isCreator === 1
        assignment.isApprover = assignment.isApprover === 1
      })
      res.send(assignments)
    } catch (err) {
      res.status(500).send({
        status: 500,
        message: err.message
      })
    }
  },

  getAssignmentById: async (req, res, next) => {
    const { checkStatus, err } = validate(req.query, queryGetAssignmentByIdSchema)
    if (!checkStatus) return res.send(err)

    try {
      const { auth } = req
      // eslint-disable-next-line camelcase
      const { assignment_id } = req.query
      const assignment = await assignmentModel.getAssignmentsById(assignment_id)
      const lecturers = []
      const lectuerCourseId = _.split(assignment.lecturer_course_id, ',')
      const lectuerId = _.split(assignment.lecturers_id, ',')
      const lecturerName = _.split(assignment.lecturers_name, ',')
      const lecturerisCreator = _.split(assignment.isCreator, ',')
      const lecturerisApprover = _.split(assignment.isApprover, ',')
      console.log(lecturerisCreator);
      for (let i = 0; i < lecturerName.length; i++) {
        lecturers.push({
          lecturer_course_id: lectuerCourseId[i],
          lecturer_id: lectuerId[i],
          lecturer_name: lecturerName[i],
          isCreator: lecturerisCreator[i] === '1',
          isApprover: lecturerisApprover[i] === '1'
        })
      }
      assignment.lecturers = lecturers
      delete assignment.lecturer_course_id
      delete assignment.lecturers_id
      delete assignment.lecturers_name
      delete assignment.isCreator
      delete assignment.isApprover

      res.send(assignment)
    } catch (err) {
      res.status(500).send({
        status: 500,
        message: err.message
      })
    }
  },

  updateLecturerApprove: async (req, res, next) => {
    const { checkStatus, err } = validate(req.body, queryUpdateLecturerApproverSchema)
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
  }
}
