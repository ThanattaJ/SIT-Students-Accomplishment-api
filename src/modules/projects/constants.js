module.exports = {
  queryAllProjects: [
    'id',
    'project_name_th',
    'project_name_en',
    'project_detail_th',
    'project_detail_en',
    'count_viewer',
    'count_clap'
  ],

  queryProjectsByStudentId: [
    'projects.id',
    'projects.project_name_th',
    'projects.project_name_en',
    'projects.project_detail_th',
    'projects.project_detail_en',
    'projects.count_viewer',
    'projects.count_clap'
  ],

  queryProjectsDetailById: [
    'projects.id',
    'projects.project_name_th',
    'projects.project_name_en',
    'projects.project_detail_th',
    'projects.project_detail_en',
    'projects.haveOutsider',
    'projects.isShow',
    'projects.tool_techniq_detail',
    'projects.references',
    'projects.count_viewer',
    'projects.count_clap',
    'projects.start_month',
    'projects.start_year_th',
    'projects.start_year_en',
    'projects.created_at',
    'projects.updated_at',
    'project_type.project_type_name'
  ],

  queryProjectStudentsMember: [
    'students.student_id',
    'students.firstname_en',
    'students.lastname_en',
    'students.email'
  ],

  queryProjectAchievement: [
    'achievement_name',
    'achievement_detail',
    'organize_by',
    'date_of_event'
  ],

  queryProjectTags: [
    'tag_id',
    'tag_name'
  ]
}
