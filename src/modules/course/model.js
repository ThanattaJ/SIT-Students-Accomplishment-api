const knex = require('../../db/knex')
const _ = require('lodash')
const { queryGetCourse, queryGetCourseHaveAssignment, querySemester, queryGetCourseSemester, queryGetLecturerCourse, queryGetCourseLecturer, queryGetCourseAssignment, queryGetProjectInCourse } = require('./constants')
module.exports = {

  getAllCourse: async () => {
    try {
      let courses
      const coursesExist = await knex('courses').select(queryGetCourse).where('isDelete', false)
      const coursesNotExist = await knex('courses').select(queryGetCourse).where('isDelete', true)
      courses = {
        course: coursesExist,
        courseIsDelete: coursesNotExist
      }
      return courses
    } catch (err) {
      throw new Error(err)
    }
  },

  getCourse: async () => {
    try {
      const courses = await knex('courses').select(queryGetCourseHaveAssignment)
        .distinct('courses.id as course_id')
        .join('lecturer_course', 'courses.id', 'lecturer_course.courses_id')
        .join('lecturer_assignment', 'lecturer_course.id', 'lecturer_assignment.lecturer_course_id')
        .join('project_assignment', 'lecturer_assignment.assignment_id', 'project_assignment.assignment_id')
        .join('status_project', 'project_assignment.status_id', 'status_project.id')
        .join('academic_term', 'lecturer_course.academic_term_id', 'academic_term.id')
        .join('academic_year', 'academic_term.academic_year_id', 'academic_year.id')
        .join('term', 'academic_term.term_id', 'term.id')
        .where('isDelete', false)
        .andWhere('status_project.status_name', 'Approve')
        .orderBy('course_code', 'asc')
      return courses
    } catch (err) {
      throw new Error(err)
    }
  },

  getProjectInCourse: async (courseId, academicTermId) => {
    try {
      const project = await knex('lecturer_course').select(queryGetProjectInCourse).distinct('project_assignment.project_id')
        .join('lecturer_assignment', 'lecturer_course.id', 'lecturer_assignment.lecturer_course_id')
        .join('project_assignment', 'lecturer_assignment.assignment_id', 'project_assignment.assignment_id')
        .join('projects', 'project_assignment.project_id', 'projects.id')
        .join('status_project', 'project_assignment.status_id', 'status_project.id')
        .where('lecturer_course.courses_id', courseId)
        .andWhere('lecturer_course.academic_term_id', academicTermId)
        .andWhere('status_project.status_name', 'Approve')
        .orderBy('projects.count_viewer', 'desc')
      return project
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
      const result = await knex('courses').select('id', 'isDelete').where('course_code', code).andWhere('course_name', name)
      if (result.length > 0) {
        if (result[0].isDelete) {
          await knex('courses').update('isDelete', false).where('course_code', code).andWhere('course_name', name)
          return {
            exist: true,
            update: true
          }
        } else {
          return {
            exist: true,
            update: false
          }
        }
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
      queryGetCourse.push('course_detail')
      const data = await knex('courses').select(queryGetCourse).where('id', id)
      return data[0]
    } catch (err) {
      throw new Error(err)
    }
  },

  deleteCourse: async (id, status) => {
    try {
      console.log(id);
      console.log(status);
      const result = await knex('courses').update('isDelete', status).where('id', id)
      return result
    } catch (err) {
      throw new Error(err)
    }
  },

  checkAcademicTerm: async (term, year) => {
    try {
      const yearData = {
        academic_year_th: parseInt(year) + 543,
        academic_year_en: year
      }
      const yearExist = (await knex('academic_year').select('id').where('academic_year_en', year)).length > 0
      if (!yearExist) {
        await knex('academic_year').insert(yearData)
      }
      const yearId = await knex('academic_year').select('id').where('academic_year_en', year)
      const termId = await knex('term').select('id').where('term_number', term)
      const academicTermData = {
        academic_year_id: yearId[0].id,
        term_id: termId[0].id
      }
      const academicTermExist = (await knex('academic_term').where('academic_year_id', yearId[0].id).andWhere('term_id', termId[0].id)).length > 0
      if (!academicTermExist) {
        await knex('academic_term').insert(academicTermData)
      }
      return await knex('academic_term').select(querySemester)
        .join('term', 'academic_term.term_id', 'term.id')
        .join('academic_year', 'academic_term.academic_year_id', 'academic_year.id')
        .orderBy('academic_term_id', 'asc')
    } catch (err) {
      throw new Error(err)
    }
  },

  getCourseSemester: async (semesterId) => {
    try {
      const data = await knex('academic_term')
        .select(queryGetCourseSemester)
        .join('academic_year', 'academic_term.academic_year_id', 'academic_year.id')
        .join('term', 'academic_term.term_id', 'term.id')
        .leftJoin('lecturer_course', 'academic_term.id', 'lecturer_course.academic_term_id')
        .leftJoin('lecturers', 'lecturer_course.lecturer_id', 'lecturers.lecturer_id')
        .leftJoin('courses', 'lecturer_course.courses_id', 'courses.id')
        .groupBy('lecturer_course.academic_term_id', 'lecturer_course.courses_id')
        .where('lecturer_course.academic_term_id', semesterId)
      return data
    } catch (err) {
      throw new Error(err)
    }
  },

  addCourseSemester: async (lecturerCourse) => {
    try {
      return await knex('lecturer_course').insert(lecturerCourse).returning('id')
    } catch (err) {
      throw new Error(err)
    }
  },

  deleteCourseSemester: async (academicTermId, courseId) => {
    try {
      return await knex('lecturer_course').del().where('academic_term_id', academicTermId).andWhere('courses_id', courseId)
    } catch (err) {
      throw new Error(err)
    }
  },

  getLecturerCourse: async (lecturerId) => {
    try {
      const data = await knex('lecturer_course')
        .select(queryGetLecturerCourse)
        .leftJoin('academic_term', 'lecturer_course.academic_term_id', 'academic_term.id')
        .join('academic_year', 'academic_term.academic_year_id', 'academic_year.id')
        .join('term', 'academic_term.term_id', 'term.id')
        .leftJoin('courses', 'lecturer_course.courses_id', 'courses.id')
        .where('lecturer_course.lecturer_id', lecturerId)
        .groupBy('academic_term')
        .orderBy('academic_term_id', 'desc')
      return data
    } catch (err) {
      throw new Error(err)
    }
  },

  getCourseSpecifySemester: async (academicTermId, courseId) => {
    try {
      const lecturerCourseId = await knex('lecturer_course').select('lecturer_course.id as lecturer_course_id', 'lecturer_course.lecturer_id')
        .where('lecturer_course.courses_id', courseId)
        .andWhere('lecturer_course.academic_term_id', academicTermId)
      return lecturerCourseId
    } catch (err) {
      throw new Error(err)
    }
  },

  getCourseAssignment: async (academicTermId, courseId) => {
    try {
      const data = await knex('lecturer_course')
        .distinct(queryGetCourseAssignment)
        .join('lecturer_assignment', 'lecturer_course.id', 'lecturer_assignment.lecturer_course_id')
        .where('lecturer_course.courses_id', courseId)
        .andWhere('lecturer_course.academic_term_id', academicTermId)
      return data
    } catch (err) {
      throw new Error(err)
    }
  },

  getCourseLecturer: async (academicTermId, courseId) => {
    try {
      const data = await knex('lecturer_course')
        .select(queryGetCourseLecturer)
        .where('lecturer_course.courses_id', courseId)
        .andWhere('lecturer_course.academic_term_id', academicTermId)
      return data
    } catch (err) {
      throw new Error(err)
    }
  },

  deleteLecturerCourseSemester: async (lecturers) => {
    try {
      const lecturerCourseId = _.map(lecturers, 'course_map_lecturer')
      await knex('lecturer_assignment').del().whereIn('lecturer_assignment.lecturer_course_id', lecturerCourseId)
      await knex('lecturer_course').del().whereIn('lecturer_course.id', lecturerCourseId)
    } catch (err) {
      throw new Error(err)
    }
  }
}
