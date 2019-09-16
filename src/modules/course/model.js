const knex = require('../../db/knex')
const { queryCourse } = require('./constants')
module.exports = {

  getCourse: async () => {
    try {
      const courses = await knex('courses').select(queryCourse).orderBy('course_code', 'asc')
      return courses
    } catch (err) {
      throw new Error(err)
    }
  },

  createCourse: async (course) => {
    try {
      const courseId = await knex('courses').insert(course).returning('id')
      return courseId[0]
    } catch (err) {
      throw new Error(err)
    }
  },

  checkCourse: async (code, name) => {
    try {
      const result = await knex('courses').select('id').where('course_code', code).andWhere('course_name', name)
      if (result.length > 0) {
        return true
      } else {
        return false
      }
    } catch (err) {
      throw new Error(err)
    }
  },

  updateCourse: async (id, course) => {
    try {
      await knex('courses').update(course).where('id', id)
      queryCourse.push('course_detail')
      const data = await knex('courses').select(queryCourse).where('id', id)
      return data[0]
    } catch (err) {
      throw new Error(err)
    } 
  },

  deleteCourse: async (id) => {
    try {
      await knex('courses').delete().where('id', id)
    } catch (err) {
      throw new Error(err)
    }
  }
}
