const knex = require('../../db/knex')
const query = require('./constants')
const _ = require('lodash')
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
      const exist = await knex('lecturer_assignment').select('id').where('lecturer_course_id', lecturerCourseId).andWhere('assignment_id', assignmentId)
      if (exist.length > 0) {
        return 'exist'
      } else {
        const data = {
          lecturer_course_id: lecturerCourseId,
          assignment_id: assignmentId,
          isCreator: isCreator,
          isApprover: isApprover
        }
        await knex('lecturer_assignment').insert(data)
      }
    } catch (err) {
      throw new Error(err)
    }
  },

  countAssignment: async (lecturerCourseId) => {
    try {
      const count = await knex('lecturer_assignment').distinct('id').count('id as assignment_counting').where('lecturer_course_id', lecturerCourseId).groupBy('lecturer_course_id')
      return count[0]
    } catch (err) {
      throw new Error(err)
    }
  },

  getStudentAssignmentsDetailById: async (assignmentId, studentId) => {
    try {
      const assignments = await knex('student_assignment')
        .select(query.queryGetStudentAssignmentsDetailById)
        .join('assignments', 'student_assignment.assignment_id', 'assignments.id')
        .join('lecturer_assignment', 'assignments.id', 'lecturer_assignment.assignment_id')
        .join('lecturer_course', 'lecturer_assignment.lecturer_course_id', 'lecturer_course.id')
        .join('courses', 'lecturer_course.courses_id', 'courses.id')
        .join('lecturers', 'lecturer_course.lecturer_id', 'lecturers.lecturer_id')
        .where('student_assignment.assignment_id', assignmentId)
        .andWhere('student_assignment.student_id', studentId)
        .andWhere('lecturer_assignment.isCreator', true)
      const project = await knex('projects')
        .select(query.queryGetStudentProjectAssignmentsDetailById)
        .join('project_assignment', 'projects.id', 'project_assignment.project_id')
        .join('assignments', 'project_assignment.assignment_id', 'assignments.id')
        .join('status_project', 'project_assignment.status_id', 'status_project.id')
        .join('project_member', 'projects.id', 'project_member.project_id')
        .where('project_member.student_id', studentId)
        .andWhere('project_assignment.assignment_id', assignmentId)
      if (project.length > 0) {
        assignments[0].project_id = project[0].project_id === undefined ? null : project[0].project_id
        assignments[0].project_name_en = project[0].project_name_en === undefined ? null : project[0].project_name_en
        assignments[0].project_name_th = project[0].project_name_th === undefined ? null : project[0].project_name_th
        assignments[0].status_name = project[0].status_name === undefined ? null : project[0].status_name
        assignments[0].comment = project[0].comment === undefined ? null : project[0].comment
      } else {
        assignments[0].project_id = null
        assignments[0].project_name_en = null
        assignments[0].project_name_th = null
        assignments[0].status_name = null
        assignments[0].comment = null
      }
      return assignments[0]
    } catch (err) {
      throw new Error(err)
    }
  },

  getListAssignmentSpecifyCourse: async (lecturerId, courseId, academic_term_id) => {
    try {
      const assignments = await knex('lecturer_course')
        .select(query.queryGetListAssignmentSpecifyCourse)
        .leftJoin('academic_term', 'lecturer_course.academic_term_id', 'academic_term.id')
        .join('academic_year', 'academic_term.academic_year_id', 'academic_year.id')
        .join('term', 'academic_term.term_id', 'term.id')
        .join('courses', 'lecturer_course.courses_id', 'courses.id')
        .leftJoin('lecturer_assignment', 'lecturer_course.id', 'lecturer_assignment.lecturer_course_id')
        .join('assignments', 'lecturer_assignment.assignment_id', 'assignments.id')
        .where('courses.id', courseId)
        .andWhere('academic_term.id', academic_term_id)
        .andWhere('lecturer_course.lecturer_id', lecturerId)
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

  getLecturerAssignmentsDetailById: async (assignmentsId) => {
    try {
      const assignments = await knex('assignments')
        .select(query.queryGetLecturerAssignmentsDetailById)
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
      assignments[0].project = count
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

  updateAssignment: async (assignmentId, detail) => {
    try {
      const update = await knex('assignments').update('assignment_detail', detail).andWhere('id', assignmentId)
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

  getAssignmentIsHaveProjectByStudentId: async (isHave, studentId) => {
    try {
      let assignments = await knex('student_assignment').select(query.queryGetAssignmentProjectByStudentId)
        .join('assignments', 'student_assignment.assignment_id', 'assignments.id')
        .where('student_assignment.student_id', studentId)
      const asssignmentId = _.map(assignments, 'assignment_id')
      const projects = await knex('projects').select('projects.id', 'status_project.status_name', 'project_assignment.comment', 'project_assignment.created_at as project_assignment_created_date', 'project_assignment.updated_at  as project_assignment_updated_date', 'project_assignment.assignment_id')
        .join('project_assignment', 'projects.id', 'project_assignment.project_id')
        .join('assignments', 'project_assignment.assignment_id', 'assignments.id')
        .join('status_project', 'project_assignment.status_id', 'status_project.id')
        .join('project_member', 'projects.id', 'project_member.project_id')
        .whereIn('project_assignment.assignment_id', asssignmentId)
        .andWhere('project_member.student_id', studentId)

      assignments.map(assignment => {
        const assignmentId = assignment.assignment_id
        const p = _.filter(projects, { 'assignment_id': assignmentId })
        if (p.length > 0) {
          assignment.project_id = p[0].id
          assignment.status_name = p[0].status_name
          assignment.comment = p[0].comment
          assignment.project_assignment_created_date = p[0].project_assignment_created_date
          assignment.project_assignment_updated_date = p[0].project_assignment_updated_date
        } else {
          assignment.project_id = null
          assignment.status_name = null
          assignment.comment = null
          assignment.project_assignment_created_date = null
          assignment.project_assignment_updated_date = null
        }
      })

      if (isHave === 'false') {
        assignments = _.filter(assignments, { 'project_id': null })
      } else if (isHave === 'true') {
        assignments = _.filter(assignments, 'project_id')
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
          .where('status_project.status_name', status)
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
      if (status === 'Approve' || status === 'Request') {
        data.comment = null
      }

      let assignments
      if (status === 'Request') {
        assignments = await knex('project_assignment').update(data)
          .andWhere('project_assignment.project_id', projectId)
      } else {
        assignments = await knex('project_assignment').update(data)
          .where('project_assignment.assignment_id', assignmentId)
          .andWhere('project_assignment.project_id', projectId)
      }
      if (status === 'Approve') {
        await knex('projects').update('isShow', true).where('projects.id', projectId)
      } else {
        await knex('projects').update('isShow', false).where('projects.id', projectId)
      }
      return assignments
    } catch (err) {
      throw new Error(err)
    }
  }
}
