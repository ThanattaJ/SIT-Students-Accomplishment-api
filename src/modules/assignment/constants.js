const knex = require('../../db/knex')

module.exports = {

  queryGetListAssignmentSpecifyCourse: [
    'assignments.id as assignment_id',
    'assignments.assignment_name',
    'assignments.join_code',
    'lecturer_assignment.isCreator',
    'lecturer_assignment.isApprover'
  ],

  queryGetStudentAssignmentsDetailById: [
    'assignments.id as assignment_id',
    'assignments.assignment_name',
    'assignments.assignment_detail',
    'assignments.join_code',
    'courses.id as course_id',
    knex.raw('CONCAT(courses.course_code,\' \',courses.course_name) as course_name'),
    knex.raw('CONCAT(lecturers.firstname,\' \',lecturers.lastname) as lecturers_name'),
    'assignments.created_at',
    'assignments.updated_at',
    'projects.id as project_id',
    'projects.project_name_en',
    'projects.project_name_th',
    'projects.project_name_th',
    'status_project.status_name',
    'project_assignment.comment'
  ],

  queryGetLecturerAssignmentsDetailById: [
    'assignments.id as assignment_id',
    'assignments.assignment_name',
    'assignments.assignment_detail',
    'assignments.join_code',
    'lecturer_course.academic_term_id',
    knex.raw('CONCAT(academic_year.academic_year_en,\'/\',term.term_number) as academic_term'),
    'courses.id as course_id',
    knex.raw('CONCAT(courses.course_code,\' \',courses.course_name) as course_name'),
    'assignments.created_at',
    'assignments.updated_at'
  ],

  queryGetAssignmentsDetailOnlyLecturer: [
    'lecturer_assignment.lecturer_course_id',
    'lecturers.lecturer_id',
    knex.raw('CONCAT(lecturers.firstname,\' \',lecturers.lastname) as lecturers_name'),
    'lecturer_assignment.isCreator',
    'lecturer_assignment.isApprover'
  ],
  queryGetAssignmentsDetailOnlyStudent: [
    'students.student_id',
    knex.raw('CONCAT(students.firstname,\' \',students.lastname) as students_name')
  ],

  queryGetAllStudentAssignments: [
    'student_assignment.assignment_id as assignment_id',
    'assignments.assignment_name',
    'assignments.join_code',
    'lecturer_course.academic_term_id',
    knex.raw('CONCAT(academic_year.academic_year_en,\'/\',term.term_number) as academic_term'),
    'courses.id as course_id',
    knex.raw('CONCAT(courses.course_code,\' \',courses.course_name) as course_name'),
    'projects.id as project_id',
    'projects.project_name_en',
    'projects.project_name_th',
    'status_project.status_name',
    'project_assignment.comment'
  ],

  queryGetAssignmenProjectByStudentId: [
    'assignments.id as assignment_id',
    'assignments.assignment_name',
    'assignments.join_code',
    'project_assignment.project_id',
    'status_project.status_name',
    'project_assignment.comment'
  ],

  queryGetProjectRequest: [
    'project_assignment.assignment_id',
    'projects.id',
    'projects.project_name_en',
    'projects.project_name_th',
    'status_project.status_name',
    'project_assignment.comment'
  ]
}
