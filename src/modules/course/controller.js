/* eslint-disable camelcase */
const { validate } = require('../validation')
const { createCourseSchema, updateCourseSchema, deleteCourseSchema, getCourseSemester, updateCourseSemesterSchema, addCourseSemesterSchema, deleteCourseSemesterSchema } = require('./json_schema')
const courseModel = require('./model')
const assignmentModel = require('../assignment/model')
const moment = require('moment')
const _ = require('lodash')

module.exports = {
  getCourse: async (req, res) => {
    try {
      const courses = await courseModel.getAllCourse()
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
      const { code, name, detail, isDelete } = req.body
      const { id } = req.query
      let data
      if (isDelete !== undefined) {
        data = await courseModel.deleteCourse(id, isDelete)
      } else {
        const course = {
          course_code: _.upperCase(code).replace(' ', ''),
          course_name: name,
          course_detail: detail || null
        }
        data = await courseModel.updateCourse(id, course)
      }
      if (data === 1) res.status(200).send({ status: 200, message: 'Update Success' })
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
      await courseModel.deleteCourse(id, true)
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
        courses = await courseModel.getCourseSemester(semester[semester.length - 1].academic_term_id)
        page.semester = semester
      } else {
        courses = await courseModel.getCourseSemester(semester_id)
      }
      courses.forEach(course => {
        const lecturers = []
        const courseMapLecturer = _.split(course.course_map_lecturer, ',')
        const lectuerId = _.split(course.lecturers_id, ',')
        const lecturerName = _.split(course.lecturers, ',')
        for (let i = 0; i < lecturerName.length; i++) {
          lecturers.push({
            course_map_lecturer: courseMapLecturer[i],
            lecturer_id: lectuerId[i],
            lecturer_name: lecturerName[i]
          })
        }
        course.lecturers = lecturers
        delete course.lecturers_id
        delete course.course_map_lecturer
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
      if (err.message.search('Duplicate entry')) {
        res.status(400).send({
          status: 409,
          message: 'This course is already exist in semester.'
        })
      } else {
        res.status(500).send({
          status: 500,
          message: err.message
        })
      }
    }
  },

  updateCourseSemester: async (req, res) => {
    const { checkStatus, err } = validate(req.body, updateCourseSemesterSchema)
    if (!checkStatus) return res.send(err)
    try {
      const { academic_term_id, course_id, lecturers } = req.body

      const lecturerNotHaveCourseMapLecturerId = lecturers.filter(lecturer => lecturer.course_map_lecturer === undefined)

      if (lecturerNotHaveCourseMapLecturerId.length > 0) {
        console.log('in if');
        await manageCourseSemester(academic_term_id, course_id, lecturerNotHaveCourseMapLecturerId)
        const assignments = await courseModel.getCourseAssignment(academic_term_id, course_id)
        const lecturers = await courseModel.getCourseLecturer(academic_term_id, course_id)
        const lecturerList = async _ => {
          const promises = lecturers.map(async lecturer => {
            const assignmentList = async _ => {
              const promises = assignments.map(async assignment => {
                await assignmentModel.mapLecturerAssignment(lecturer.lecturer_course_id, assignment.assignment_id, false, false)
              })
              await Promise.all(promises)
            }
            await assignmentList()
          })
          await Promise.all(promises)
        }
        await lecturerList()
      }

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
  },

  getCourseLecturer: async (lecturerId) => {
    try {
      const courses = await courseModel.getLecturerCourse(lecturerId)
      courses.forEach(course => {
        const tmpCourses = []
        const lecturerCourseId = _.split(course.lecturer_course_id, ',')
        const courseId = _.split(course.course_id, ',')
        const courseName = _.split(course.courses, ',')

        for (let i = 0; i < courseName.length; i++) {
          tmpCourses.push({
            lecturer_course_id: lecturerCourseId[i],
            course_id: courseId[i],
            course_name: courseName[i]
          })
        }
        course.courses = tmpCourses
        delete course.course_id
        delete course.lecturer_course_id
      })

      const manageCourses = async _ => {
        const promises = courses.map(async course => {
          const coursesAssignment = async _ => {
            const promises = course.courses.map(async c => {
              const countAssignment = await assignmentModel.countAssignment(c.lecturer_course_id)
              c.assignment_counting = countAssignment === undefined ? 0 : countAssignment.assignment_counting
              delete c.lecturer_course_id
            })
            await Promise.all(promises)
          }
          await coursesAssignment()
        })
        await Promise.all(promises)
      }
      await manageCourses()

      return courses
    } catch (err) {
      throw new Error(err)
    }
  },

  getCourseSpecifySemester: async (academicTermId, courseId) => {
    try {
      return await courseModel.getCourseSpecifySemester(academicTermId, courseId)
    } catch (err) {
      throw new Error(err)
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
    return await courseModel.checkAcademicTerm(term, year)
  } catch (err) {
    throw new Error(err)
  }
}

async function manageCourseSemester (academicTermId, courseId, lecturers) {
  try {
    lecturers.forEach(lecturer => {
      lecturer.academic_term_id = academicTermId
      lecturer.courses_id = courseId
    })

    const mapLecturerCourse = async _ => {
      const promises = lecturers.map(async lecturer => {
        const data = await courseModel.addCourseSemester(lecturer)
        return data
      })
      await Promise.all(promises)
    }
    await mapLecturerCourse()
  } catch (err) {
    throw new Error(err)
  }
}
