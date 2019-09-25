/* eslint-disable camelcase */
const { validate } = require('../validation')
const { createCourseSchema, updateCourseSchema, deleteCourseSchema, getCourseSemester, addCourseSemesterSchema, deleteCourseSemesterSchema } = require('./json_schema')
const courseModel = require('./model')
// const authenController = require('../authentication/controller')
const moment = require('moment')
const _ = require('lodash')

module.exports = {
  getCourse: async (req, res) => {
    try {
      const courses = await courseModel.getCourse()
      res.send(courses)
    } catch (err) {
      res.status(500).send({
        status: 500,
        message: err.message
      })
    }
  },

  createCourse: async (req, res) => {
    const { checkStatus, err } = validate(req.body, createCourseSchema)
    if (!checkStatus) return res.send(err)

    try {
      const { code, name, detail } = req.body
      const course = {
        course_code: _.upperCase(code).replace(' ', ''),
        course_name: name,
        course_detail: detail || null
      }
      const { exist, update } = await courseModel.checkCourse(code, name)
      if (exist && !update) {
        res.send({
          status: 400,
          message: 'This course already exists in the system.'
        })
      } else if (exist && update) {
        res.send(course)
      } else {
        await courseModel.createCourse(course)
        res.send(course)
      }
    } catch (err) {
      res.status(500).send({
        status: 500,
        message: err.message
      })
    }
  },

  updateCourse: async (req, res) => {
    const { checkStatus, err } = validate(req.body, updateCourseSchema)
    if (!checkStatus) return res.send(err)

    try {
      const { code, name, detail } = req.body
      const course = {
        course_code: _.upperCase(code).replace(' ', ''),
        course_name: name,
        course_detail: detail || null
      }
      const { id } = req.query
      const data = await courseModel.updateCourse(id, course)
      res.send(data)
    } catch (err) {
      res.status(500).send({
        status: 500,
        message: err.message
      })
    }
  },

  deleteCourse: async (req, res) => {
    const { checkStatus, err } = validate(req.query, deleteCourseSchema)
    if (!checkStatus) return res.send(err)
    try {
      const { id } = req.query
      await courseModel.deleteCourse(id)
      res.status(200).send({
        status: 200,
        data: 'Delete course success!'
      })
    } catch (err) {
      res.status(500).send({
        status: 500,
        message: err.message
      })
    }
  },

  getCourseSemester: async (req, res) => {
    const { checkStatus, err } = validate(req.query, getCourseSemester)
    if (!checkStatus) return res.send(err)
    let page = {}
    let courses
    try {
      const { semester_id } = req.query
      if (semester_id === undefined) {
        const semester = await triggerTerm()
        courses = await courseModel.getCourseSemester(semester[semester.length - 1].id)
        page.semesters = semester
      } else {
        courses = await courseModel.getCourseSemester(semester_id)
      }
      courses.forEach(course => {
        const lecturers = []
        const lectuerId = _.split(course.lecturers_id, ',')
        const lecturerName = _.split(course.lecturers, ',')
        for (let i = 0; i < lecturerName.length; i++) {
          lecturers.push({
            lecturer_id: lectuerId[i],
            lecturer_name: lecturerName[i]
          })
        }
        course.lecturers = lecturers
        delete course.lecturers_id
      })
      page.course = courses
      res.send(page)
    } catch (err) {
      res.status(500).send({
        status: 500,
        message: err.message
      })
    }
  },

  addCourseSemester: async (req, res) => {
    const { checkStatus, err } = validate(req.body, addCourseSemesterSchema)
    if (!checkStatus) return res.send(err)
    try {
      const { academic_term_id, course_id, lecturers } = req.body
      await manageCourseSemester(academic_term_id, course_id, lecturers)
      res.status(200).send({
        status: 200,
        message: 'Add course success.'
      })
    } catch (err) {
      res.status(500).send({
        status: 500,
        message: err.message
      })
    }
  },

  updateCourseSemester: async (req, res) => {
    const { checkStatus, err } = validate(req.body, addCourseSemesterSchema)
    if (!checkStatus) return res.send(err)
    try {
      const { academic_term_id, course_id, lecturers } = req.body
      await courseModel.deleteCourseSemester(academic_term_id, course_id)
      await manageCourseSemester(academic_term_id, course_id, lecturers)
      res.status(200).send({
        status: 200,
        message: 'Update course success.'
      })
    } catch (err) {
      res.status(500).send({
        status: 500,
        message: err.message
      })
    }
  },

  deleteCourseSemester: async (req, res) => {
    const { checkStatus, err } = validate(req.body, deleteCourseSemesterSchema)
    if (!checkStatus) return res.send(err)
    try {
      const { academic_term_id, course_id } = req.body
      await courseModel.deleteCourseSemester(academic_term_id, course_id)
      res.status(200).send({
        status: 200,
        message: 'Delete course success.'
      })
    } catch (err) {
      res.status(500).send({
        status: 500,
        message: err.message
      })
    }
  }
}

async function triggerTerm () {
  try {
    const now = moment().format('YYYY-MM-DD')
    const year = moment().format('YYYY')
    let term
    if (moment(now).isBetween(`${year}-05-01`, `${year}-11-30`)) {
      term = 1
    } else if (moment(now).isBetween(`${year}-12-01`, `${year}-04-30`)) {
      term = 2
    }
    console.log('term', term)
    return await courseModel.checkAcademicTerm(term, year)
  } catch (err) {
    throw new Error(err)
  }
}

async function manageCourseSemester (academicTermId, courseId, lecturers) {
  lecturers.forEach(lecturer => {
    lecturer.academic_term_id = academicTermId
    lecturer.courses_id = courseId
  })

  const mapLecturerCourse = async _ => {
    const promises = lecturers.map(async lecturer => {
      const data = await courseModel.addCourseSemester(lecturer)
      return data
    })
    const all = await Promise.all(promises)
  }

  mapLecturerCourse()
}
