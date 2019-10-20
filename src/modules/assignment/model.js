const knex = require('../../db/knex')
const query = require('./constants')
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

  countAssignment: async (lecturerCourseId) => {
    try {
      const count = await knex('lecturer_assignment').count('id as assignment_counting').where('lecturer_course_id', lecturerCourseId).groupBy('lecturer_course_id')
      return count[0]
    } catch (err) {
      throw new Error(err)
    }
  },

  getStudentAssignments: async (studentId) => {
    try {
      const assignments = await knex('lecturer_course')
        .select(query.queryGetAllStudentAssignments)
        .leftJoin('academic_term', 'lecturer_course.academic_term_id', 'academic_term.id')
        .join('academic_year', 'academic_term.academic_year_id', 'academic_year.id')
        .join('term', 'academic_term.term_id', 'term.id')
        .join('courses', 'lecturer_course.courses_id', 'courses.id')
        .leftJoin('lecturer_assignment', 'lecturer_course.id', 'lecturer_assignment.lecturer_course_id')
        .join('assignments', 'lecturer_assignment.assignment_id', 'assignments.id')
        .join('student_assignment', 'assignments.id', 'student_assignment.assignment_id')
        .where('student_assignment.student_id', studentId)
        .orderBy('academic_term_id', 'desc')
      return assignments
    } catch (err) {
      throw new Error(err)
    }
  },

  getListAssignmentSpecifyCourse: async (courseId) => {
    try {
      const assignments = await knex('lecturer_course')
        .select(query.querygetListAssignmentSpecifyCourse)
        .leftJoin('academic_term', 'lecturer_course.academic_term_id', 'academic_term.id')
        .join('academic_year', 'academic_term.academic_year_id', 'academic_year.id')
        .join('term', 'academic_term.term_id', 'term.id')
        .join('courses', 'lecturer_course.courses_id', 'courses.id')
        .leftJoin('lecturer_assignment', 'lecturer_course.id', 'lecturer_assignment.lecturer_course_id')
        .join('assignments', 'lecturer_assignment.assignment_id', 'assignments.id')
        .where('courses.id', courseId)
        .groupBy('assignments.id')
      return assignments
    } catch (err) {
      throw new Error(err)
    }
  },

  countProjectAndStudent: async (assignmentId) => {
    try {
      const project = await knex('project_assignment').count('project_assignment.id as count').where('project_assignment.assignment_id', assignmentId)
      const student = await knex('student_assignment').count('student_assignment.student_id as count').where('student_assignment.assignment_id', assignmentId)
      const count = {
        project: project[0].count,
        student: student[0].count
      }
      return count
    } catch (err) {
      throw new Error(err)
    }
  },

  getAssignmentsDetailById: async (assignmentsId) => {
    try {
      const assignments = await knex('assignments')
        .select(query.queryGetAssignmentsDetailById)
        .join('lecturer_assignment', 'assignments.id', 'lecturer_assignment.assignment_id')
        .join('lecturer_course', 'lecturer_assignment.lecturer_course_id', 'lecturer_course.id')
        .join('academic_term', 'lecturer_course.academic_term_id', 'academic_term.id')
        .join('academic_year', 'academic_term.academic_year_id', 'academic_year.id')
        .join('term', 'academic_term.term_id', 'term.id')
        .join('courses', 'lecturer_course.courses_id', 'courses.id')
        .where('assignments.id', assignmentsId)
        .groupBy('academic_term.id')

      const lecturers = await knex('lecturer_assignment').select(query.queryGetAssignmentsDetailOnlyLecturer)
        .join('lecturer_course', 'lecturer_assignment.lecturer_course_id', 'lecturer_course.id')
        .join('lecturers', 'lecturer_course.lecturer_id', 'lecturers.lecturer_id')
        .where('lecturer_assignment.assignment_id', assignmentsId)

      const students = await knex('assignments').select(query.queryGetAssignmentsDetailOnlyStudent)
        .leftJoin('student_assignment', 'assignments.id', 'student_assignment.assignment_id')
        .leftJoin('students', 'student_assignment.student_id', 'students.student_id')
        .where('assignments.id', assignmentsId)

      assignments[0].lecturers = lecturers
      assignments[0].students = students

      const count = await knex('project_assignment').select('status_project.status_name').count('project_assignment.project_id as count')
        .join('status_project', 'project_assignment.status_id', 'status_project.id')
        .groupBy('project_assignment.status_id')
        .where('project_assignment.assignment_id', assignmentsId)
      assignments[0].poject = count
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

  joinAssignment: async (joinCode, stundentId) => {
    try {
      const assignmentId = await knex('assignments').select('id').where('join_code', joinCode)
      const exist = await knex('student_assignment').select('assignment_id', 'student_id')
        .where('assignment_id', assignmentId[0].id)
        .andWhere('student_id', stundentId)
      if (exist.length > 0) {
        return {
          status: 409,
          message: 'You already joined the assignment'
        }
      } else {
        const data = {
          assignment_id: assignmentId[0].id,
          student_id: stundentId
        }
        await knex('student_assignment').insert(data)
        return {
          status: 200,
          message: 'You have successfully joined.'
        }
      }
    } catch (err) {
      throw new Error(err)
    }
  },

  checkStudentInAssignment: async (assignmentId, stundentId) => {
    try {
      const exist = await knex('student_assignment').select('assignment_id', 'student_id')
        .where('assignment_id', assignmentId)
        .andWhere('student_id', stundentId)
      if (exist.length > 0) {
        return true
      } else {
        const data = {
          assignment_id: assignmentId,
          student_id: stundentId
        }
        await knex('student_assignment').insert(data)
        return false
      }
    } catch (err) {
      throw new Error(err)
    }
  },

  getAssignmentIsHaveProjectByStudentId: async (isHave, stundentId) => {
    try {
      let assignments
      if (isHave === 'false') {
        assignments = await knex('assignments').select(query.queryGetAssignmentNotHaveProjectByStudentId)
          .join('student_assignment', 'assignments.id', 'student_assignment.assignment_id')
          .leftJoin('project_assignment', 'assignments.id', 'project_assignment.assignment_id')
          .whereNull('project_assignment.id')
          .andWhere('student_assignment.student_id', stundentId)
      } else {
        assignments = await knex('assignments').select(query.queryGetAssignmentNotHaveProjectByStudentId)
          .join('student_assignment', 'assignments.id', 'student_assignment.assignment_id')
          .leftJoin('project_assignment', 'assignments.id', 'project_assignment.assignment_id')
          .whereNotNull('project_assignment.id')
          .andWhere('student_assignment.student_id', stundentId)
      }
      return assignments
    } catch (err) {
      throw new Error(err)
    }
  },

  getProjectInAssignment: async (assignmentId, status) => {
    try {
      let projects
      if (status !== 'Request') {
        projects = await knex('project_assignment').select(query.queryGetProjectRequest)
          .join('status_project', 'project_assignment.status_id', 'status_project.id')
          .join('projects', 'project_assignment.project_id', 'projects.id')
          .where('project_assignment.assignment_id', assignmentId)
          .andWhere('status_project.status_name', status)
      } else {
        projects = await knex('project_assignment').select(query.queryGetProjectRequest)
          .join('status_project', 'project_assignment.status_id', 'status_project.id')
          .join('projects', 'project_assignment.project_id', 'projects.id')
          .andWhere('status_project.status_name', status)
      }
      return projects
    } catch (err) {
      throw new Error(err)
    }
  },

  updateProjectStatus: async (assignmentId, projectId, status, comment) => {
    try {
      const statusId = await knex('status_project').select('id').where('status_name', status)
      const data = {
        status_id: statusId[0].id,
        comment: comment
      }
      const assignments = await knex('project_assignment').update(data)
        .where('project_assignment.assignment_id', assignmentId)
        .andWhere('project_assignment.project_id', projectId)
      return assignments
    } catch (err) {
      throw new Error(err)
    }
  }
}
