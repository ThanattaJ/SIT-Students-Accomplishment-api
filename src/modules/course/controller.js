const { validate } = require('../validation')
const { createCourseSchema, updateCourseSchema } = require('./json_schema')
const courseModel = require('./model')
// const authenController = require('../authentication/controller')
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
      const exist = await courseModel.checkCourse(code, name)
      if (exist) {
        res.send({
          status: 400,
          message: 'This course already exists in the system.'
        })
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
  }
}
