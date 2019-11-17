/* eslint-disable camelcase */
const _ = require('lodash')
const moment = require('moment')
const assignmentModel = require('./model')
const courseController = require('../course/controller')
const projectModel = require('../projects/model')
const filesModel = require('../files/model')
const notiController = require('../notification/controller')
const { validate } = require('../validation')
const json = require('./json_schema')
const randomstring = require('randomstring')

module.exports = {
  createAssignment: async (req, res, next) => {
    const { checkStatus, err } = validate(req.body, json.createAssignmentSchema)
    if (!checkStatus) return res.send(err)

    try {
      const { auth } = req
      const { academic_term_id, course_id, assignment_name, assignment_detail, isGroup, close_date } = req.body
      const courseSemesters = await courseController.getCourseSpecifySemester(academic_term_id, course_id)
      const closeDate = moment(close_date, 'DD-MM-YYYY').format('YYYY-MM-DD')
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
        join_code: code,
        isGroup: isGroup,
        close_date: closeDate
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
        assignment_id: assignmentId[0].id
      })
    } catch (err) {
      res.status(500).send({
        status: 500,
        message: err.message
      })
    }
  },

  getListAssignmentSpecifyCourse: async (req, res, next) => {
    const { checkStatus, err } = validate(req.query, json.getListAssignmentSpecifyCourseSchema)
    if (!checkStatus) return res.send(err)

    try {
      const { auth } = req
      const { course_id } = req.query
      if (auth.role !== 'lecturer') { res.status(403).send({ auth: false, message: 'Permission Denied' }) }

      const assignments = await assignmentModel.getListAssignmentSpecifyCourse(auth.uid, course_id)
      assignments.map(assignment => {
        assignment.isGroup = assignment.isGroup === 1
        assignment.close_date = moment(assignment.close_date).format('DD-MM-YYYY')
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
    const { checkStatus, err } = validate(req.params, json.getAssignmentsDetailByIdSchema)
    if (!checkStatus) return res.send(err)

    try {
      const { assignment_id } = req.params
      const { auth } = req
      let assignment
      if (auth.role === 'lecturer') {
        assignment = await assignmentModel.getLecturerAssignmentsDetailById(assignment_id)
        const newLecturers = assignment.lecturers
        newLecturers.map(newLecturer => {
          newLecturer.isCreator = newLecturer.isCreator === 1
          newLecturer.isApprover = newLecturer.isApprover === 1
        })
        assignment.lecturers = newLecturers
      } else if (auth.role === 'student') {
        assignment = await assignmentModel.getStudentAssignmentsDetailById(assignment_id, auth.uid)
        const cover = await filesModel.getCoverImage(assignment.project_id)
        assignment.cover_path = cover[0] ? cover[0].path_name : null
      }

      assignment.isGroup = assignment.isGroup === 1
      assignment.close_date = moment(assignment.close_date).format('DD-MM-YYYY')
      assignment.created_at = moment(assignment.created_at).format('MMM Do YYYY, h:mm:ss a')
      assignment.updated_at = moment(assignment.updated_at).format('MMM Do YYYY, h:mm:ss a')

      res.send(assignment)
    } catch (err) {
      res.status(500).send({
        status: 500,
        message: err.message
      })
    }
  },

  updateLecturerApprove: async (req, res, next) => {
    const { checkStatus, err } = validate(req.body, json.updateLecturerApproverSchema)
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

  updateAssignment: async (req, res, next) => {
    const { checkStatus, err } = validate(req.body, json.updateAssignmentSchema)
    if (!checkStatus) return res.send(err)

    try {
      const { assignment_id, assignment_detail } = req.body
      await assignmentModel.updateAssignment(assignment_id, assignment_detail)
      res.status(200).send({
        status: 200,
        message: assignment_id
      })
    } catch (err) {
      res.status(500).send({
        status: 500,
        message: err.message
      })
    }
  },

  joinAssignment: async (req, res, next) => {
    const { checkStatus, err } = validate(req.query, json.joinAssignmentSchema)
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
    const { checkStatus, err } = validate(req.query, json.getAssignmentProjectByStudentIdSchema)
    if (!checkStatus) return res.send(err)

    try {
      const { auth } = req
      if (auth.role !== 'student') { res.status(403).send({ auth: false, message: 'Permission Denied' }) }
      const { isHave } = req.query
      let assignments = await assignmentModel.getAssignmentIsHaveProjectByStudentId(isHave, auth.uid)

      assignments.map(assignment => {
        const now = moment().format('YYYY-MM-DD')
        assignment.time_up = !moment(now).isSameOrBefore(assignment.close_date)
        assignment.isGroup = assignment.isGroup === 1
        assignment.close_date = moment(assignment.close_date).format('DD-MM-YYYY')
        assignment.project_assignment_created_date = assignment.project_assignment_created_date === null ? null : moment(assignment.project_assignment_created_date).format('MMM Do YYYY, h:mm:ss a')
        assignment.project_assignment_updated_date = assignment.project_assignment_updated_date === null ? null : moment(assignment.project_assignment_updated_date).format('MMM Do YYYY, h:mm:ss a')
      })
      res.send(assignments)
    } catch (err) {
      res.status(500).send({
        status: 500,
        message: err.message
      })
    }
  },

  getProjectRequest: async (req, res, next) => {
    const { checkStatus, err } = validate(req.query, json.getProjectRequestSchema)
    if (!checkStatus) return res.send(err)

    try {
      const { auth } = req
      if (auth.role !== 'lecturer') { res.status(403).send({ auth: false, message: 'Permission Denied' }) }
      const { assignment_id, status } = req.query || undefined
      const projects = await assignmentModel.getProjectInAssignment(assignment_id, status)
      projects.map(project => {
        project.project_assignment_created_date = project.project_assignment_created_date === null ? null : moment(project.project_assignment_created_date).format('MMM Do YYYY, h:mm:ss a')
        project.project_assignment_updated_date = project.project_assignment_updated_date === null ? null : moment(project.project_assignment_updated_date).format('MMM Do YYYY, h:mm:ss a')
      })

      res.send(projects)
    } catch (err) {
      res.status(500).send({
        status: 500,
        message: err.message
      })
    }
  },

  updateProjectStatus: async (req, res, next) => {
    const { checkStatus, err } = validate(req.body, json.updateProjectStatusSchema)
    if (!checkStatus) return res.send(err)

    try {
      let { assignment_id, project_id, status, comment } = req.body || undefined
      const { auth } = req
      if (auth.role === 'student' && status !== 'Request') {
        res.status(403).send({ auth: false, message: 'Permission Denied' })
      }

      console.log(status);
      let oldProjects = []
      if (auth.role !== 'student') {
        console.log('object');
        oldProjects = await assignmentModel.getProjectInAssignment(assignment_id, 'Request')
        oldProjects = _.filter(oldProjects, { 'project_id': project_id })
        if (oldProjects.length > 0) {
          status = status === 'Reject' ? 'Approve' : 'Waiting'
        }
      }

      const projects = await assignmentModel.updateProjectStatus(assignment_id, project_id, status, comment)
      console.log('hi');
      let assignment = null
      assignment = await assignmentModel.getLecturerAssignmentsDetailById(assignment_id)
      delete assignment.lecturers
      delete assignment.students

      assignment.isGroup = assignment.isGroup === 1
      assignment.close_date = moment(assignment.close_date).format('DD-MM-YYYY')

      const page = await projectModel.getShortProjectDetailById(project_id)
      let projectAssignmentStatus = page.project_detail.status_name || null
      if (oldProjects.length > 0) {
        await notiController.sendEmail(project_id, auth.fullname, page, 'consider', assignment, projectAssignmentStatus)
      } else {
        console.log(auth.role);
        if (auth.role !== 'student' && status !== 'Request') {
          console.log('why');
          await notiController.sendEmail(project_id, auth.fullname, page, 'check', assignment, projectAssignmentStatus)
        } else {
          console.log('who');
          await notiController.sendEmail(project_id, auth.fullname, page, 'request', assignment, projectAssignmentStatus)
        }
      }

      res.status(200).send({
        status: 200,
        message: `Updated ${project_id} success.`
      })
    } catch (err) {
      res.status(500).send({
        status: 500,
        message: err.message
      })
    }
  }
}
