const knex = require('../../db/knex')

module.exports = {
  queryGetCourse: [
    'id',
    'course_code',
    'course_name',
    'course_detail'
  ],

  querySemester: [
    'academic_term.id as academic_term_id',
    knex.raw('CONCAT(academic_year.academic_year_en,\'/\',term.term_number) as academic_term')
  ],

  queryGetCourseSemester: [
    'lecturer_course.academic_term_id',
    'courses.id as course_id',
    knex.raw('CONCAT(courses.course_code,\' \',courses.course_name) as course'),
    knex.raw('GROUP_CONCAT(lecturer_course.id) as course_map_lecturer'),
    knex.raw('GROUP_CONCAT(lecturer_course.lecturer_id) as lecturers_id'),
    knex.raw('GROUP_CONCAT(CONCAT(lecturers.firstname,\' \',lecturers.lastname)) as lecturers')
  ],

  queryGetLecturerCourse: [
    knex.raw('GROUP_CONCAT(lecturer_course.id) as lecturer_course_id'),
    'lecturer_course.academic_term_id',
    knex.raw('CONCAT(academic_year.academic_year_en,\'/\',term.term_number) as academic_term'),
    knex.raw('GROUP_CONCAT(courses.id) as course_id'),
    knex.raw('GROUP_CONCAT(CONCAT(courses.course_code,\' \',courses.course_name)) as courses')
  ],

  queryGetCourseHaveNotAssignment: [
    'lecturer_course.id as lecturer_course_id',
    'lecturer_course.academic_term_id',
    knex.raw('CONCAT(academic_year.academic_year_en,\'/\',term.term_number) as academic_term'),
    'courses.id as course_id',
    knex.raw('CONCAT(courses.course_code,\' \',courses.course_name) as course_name'),
    'lecturer_assignment.id as assignment_id'
  ],

  queryGetCourseAssignment: [
    'lecturer_assignment.id as assignment_id'
  ]
}
