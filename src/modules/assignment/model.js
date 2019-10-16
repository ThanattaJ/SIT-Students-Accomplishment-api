const knex = require('../../db/knex')
const { queryGetAllLecturerAssignments, queryGetAssignmentsById, queryGetAllStudentAssignments } = require('./constants')
module.exports = {
  createAssignment: async (assignment) => {
    try {
      return await knex('assignments')
        .insert(assignment)
        .returning('id')
    } catch (err) {
      throw new Error(err)
    }
  },

  checkJoinCode: async (code) => {
    try {
      const exist = await knex('assignments').select('join_code').where('join_code', code)
      if (exist.length > 0) {
        return true
      } else {
        return false
      }
    } catch (err) {
      throw new Error(err)
    }
  },

  mapLecturerAssignment: async (lecturerCourseId, assignmentId, isCreator, isApprover) => {
    try {
      const data = {
        lecturer_course_id: lecturerCourseId,
        assignment_id: assignmentId,
        isCreator: isCreator,
        isApprover: isApprover
      }
      await knex('lecturer_assignment').insert(data)
    } catch (err) {
      throw new Error(err)
    }
  },

  checkAssignment: async (lecturerCourseId) => {
    try {
      const exist = await knex('lecturer_assignment').select('id').where('lecturer_course_id', lecturerCourseId)
      if (exist.length > 0) {
        return true
      } else {
        return false
      }
    } catch (err) {
      throw new Error(err)
    }
  },
  getPersonAssignments: async (userRole, userId) => {
    try {
      let assignments
      if (userRole === 'lecturer') {
        assignments = await knex('lecturer_course')
          .select(queryGetAllLecturerAssignments)
          .leftJoin('academic_term', 'lecturer_course.academic_term_id', 'academic_term.id')
          .join('academic_year', 'academic_term.academic_year_id', 'academic_year.id')
          .join('term', 'academic_term.term_id', 'term.id')
          .join('courses', 'lecturer_course.courses_id', 'courses.id')
          .leftJoin('lecturer_assignment', 'lecturer_course.id', 'lecturer_assignment.lecturer_course_id')
          .join('assignments', 'lecturer_assignment.assignment_id', 'assignments.id')
          .where('lecturer_course.lecturer_id', userId)
          .orderBy('academic_term_id', 'desc')
      } else if (userRole === 'student') {
        assignments = await knex('lecturer_course')
          .select(queryGetAllStudentAssignments)
          .leftJoin('academic_term', 'lecturer_course.academic_term_id', 'academic_term.id')
          .join('academic_year', 'academic_term.academic_year_id', 'academic_year.id')
          .join('term', 'academic_term.term_id', 'term.id')
          .join('courses', 'lecturer_course.courses_id', 'courses.id')
          .leftJoin('lecturer_assignment', 'lecturer_course.id', 'lecturer_assignment.lecturer_course_id')
          .join('assignments', 'lecturer_assignment.assignment_id', 'assignments.id')
          .join('student_assignment', 'assignments.id', 'student_assignment.assignment_id')
          .where('student_assignment.student_id', userId)
          .orderBy('academic_term_id', 'desc')
      }
      return assignments
    } catch (err) {
      throw new Error(err)
    }
  },

  getAssignmentsById: async (assignmentsId) => {
    try {
      const assignments = await knex('assignments')
        .select(queryGetAssignmentsById)
        .join('lecturer_assignment', 'assignments.id', 'lecturer_assignment.assignment_id')
        .join('lecturer_course', 'lecturer_assignment.lecturer_course_id', 'lecturer_course.id')
        .leftJoin('academic_term', 'lecturer_course.academic_term_id', 'academic_term.id')
        .join('academic_year', 'academic_term.academic_year_id', 'academic_year.id')
        .join('term', 'academic_term.term_id', 'term.id')
        .join('courses', 'lecturer_course.courses_id', 'courses.id')
        .join('lecturers', 'lecturer_course.lecturer_id', 'lecturers.lecturer_id')
        .join('student_assignment', 'assignments.id', 'student_assignment.assignment_id')
        .join('students', 'student_assignment.student_id', 'students.student_id')
        .groupBy('assignment_id', 'assignment_name', 'join_code', 'academic_term_id', 'academic_term', 'course_id', 'course_name')
        .where('assignments.id', assignmentsId)
      return assignments[0]
    } catch (err) {
      throw new Error(err)
    }
  },

  updateLecturerApprove: async (assignmentId, lecturerCourseId, isApprove) => {
    try {
      const update = await knex('lecturer_assignment').update('isApprover', isApprove).where('lecturer_course_id', lecturerCourseId).andWhere('assignment_id', assignmentId)
      return update
    } catch (err) {
      throw new Error(err)
    }
  },

  joinAssignment: async (joinCode, stundetId) => {
    try {
      const assignmentId = await knex('assignments').select('id').where('join_code', joinCode)
      const data = {
        assignment_id: assignmentId[0].id,
        student_id: stundetId
      }
      await knex('student_assignment').insert(data)
    } catch (err) {
      throw new Error(err)
    }
  }

}
