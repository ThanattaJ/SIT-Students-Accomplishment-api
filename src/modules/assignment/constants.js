const knex = require('../../db/knex')

module.exports = {
  // queryGetAllLecturerAssignments: [
  //   'lecturer_course.academic_term_id',
  //   knex.raw('CONCAT(academic_year.academic_year_en,\'/\',term.term_number) as academic_term'),
  //   'courses.id as course_id',
  //   knex.raw('CONCAT(courses.course_code,\' \',courses.course_name) as course_name'),
  //   'assignments.id as assignment_id',
  //   'assignments.assignment_name',
  //   'assignments.join_code',
  //   'lecturer_assignment.isCreator',
  //   'lecturer_assignment.isApprover'
  // ],

  querygetListAssignmentSpecifyCourse: [
    'assignments.id as assignment_id',
    'assignments.assignment_name',
    'assignments.join_code',
    'lecturer_assignment.isCreator',
    'lecturer_assignment.isApprover'
  ],

  queryGetAssignmentsDetailById: [
    'assignments.id as assignment_id',
    'assignments.assignment_name',
    'assignments.assignment_detail',
    'assignments.join_code',
    'lecturer_course.academic_term_id',
    knex.raw('CONCAT(academic_year.academic_year_en,\'/\',term.term_number) as academic_term'),
    'courses.id as course_id',
    knex.raw('CONCAT(courses.course_code,\' \',courses.course_name) as course_name'),
    'assignments.created_at',
    'assignments.updated_at',
    knex.raw('GROUP_CONCAT(lecturer_assignment.lecturer_course_id) as lecturer_course_id'),
    knex.raw('GROUP_CONCAT(lecturers.lecturer_id) as lecturers_id'),
    knex.raw('GROUP_CONCAT(CONCAT(lecturers.firstname,\' \',lecturers.lastname)) as lecturers_name'),
    knex.raw('GROUP_CONCAT(lecturer_assignment.isCreator) as isCreator'),
    knex.raw('GROUP_CONCAT(lecturer_assignment.isApprover) as isApprover'),
    knex.raw('GROUP_CONCAT(students.student_id) as students_id'),
    knex.raw('GROUP_CONCAT(CONCAT(students.firstname,\' \',students.lastname)) as students_name')
  ],

  queryGetAllStudentAssignments: [
    'assignments.id as assignment_id',
    'assignments.assignment_name',
    'assignments.join_code',
    'lecturer_course.academic_term_id',
    knex.raw('CONCAT(academic_year.academic_year_en,\'/\',term.term_number) as academic_term'),
    'courses.id as course_id',
    knex.raw('CONCAT(courses.course_code,\' \',courses.course_name) as course_name')
  ],

  queryGetAssignmentNotHaveProjectByStudentId: [
    'assignments.id as assignment_id',
    'assignments.assignment_name',
    'project_assignment.id as project'
  ],

  queryGetProjectRequest: [
    'projects.id',
    'projects.project_name_en',
    'projects.project_name_th',
    'project_assignment.comment'
  ]
}
