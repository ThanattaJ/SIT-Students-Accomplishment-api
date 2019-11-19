const knex = require('../../db/knex')

module.exports = {
  queryAllProjects: [
    'projects.id',
    'projects.project_name_th',
    'projects.project_name_en',
    'projects.project_detail',
    'projects.project_abstract',
    'projects.isShow',
    'projects.count_viewer',
    'projects.count_clap'
  ],

  queryProjectsByStudentId: [
    'projects.id',
    'projects.project_name_th',
    'projects.project_name_en',
    'projects.project_detail',
    'projects.project_abstract',
    'projects.start_month',
    'projects.start_year_en',
    'projects.end_month',
    'projects.end_year_en',
    'projects.count_viewer',
    'projects.count_clap',
    'projects.isShow',
    'assignments.assignment_name',
    'status_project.status_name'
  ],

  queryProjectsDetailById: [
    'projects.id',
    'projects.project_name_th',
    'projects.project_name_en',
    'projects.project_detail',
    'projects.project_abstract',
    'projects.haveOutsider',
    'projects.isShow',
    'projects.tool_techniq_detail',
    'projects.references',
    'projects.github',
    'projects.count_viewer',
    'projects.count_clap',
    'projects.start_month',
    'projects.start_year_th',
    'projects.start_year_en',
    'projects.end_month',
    'projects.end_year_th',
    'projects.end_year_en',
    'projects.created_at',
    'projects.updated_at',
    'project_type.project_type_name',
    'project_assignment.assignment_id',
    'status_project.status_name',
    knex.raw('CONCAT(project_assignment.comment) as comment')
  ],

  queryProjectStudentsMember: [
    'students.student_id',
    'students.firstname',
    'students.lastname',
    'students.email'
  ],

  queryProjectAchievement: [
    'project_id',
    'achievement_name',
    'achievement_detail',
    'organize_by',
    'date_of_event'
  ],

  queryProjectTags: [
    'tag_id',
    'tag_name'
  ],

  queryCountProjectByYear: [
    'projects.start_year_en'
  ]
}
