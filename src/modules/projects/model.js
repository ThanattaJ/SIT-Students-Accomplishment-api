const knex = require('../../db/knex')
module.exports = {

  getAllProjects: async () => {
    const result = await knex.select('id', 'project_name_th', 'project_name_en', 'project_detail_th', 'project_detail_en').from('projects').where('isShow', true)
    return result
  },

  getProjectsByStudentId: async (id) => {
    console.log('--------------------------')
    const result = await knex('projects').select('projects.project_name_th', 'projects.project_name_en',
      'projects.project_detail_th', 'projects.project_detail_en', 'projects.count_viewer', 'projects.count_clap')
      .join('project_member', 'projects.id', 'project_member.project_id')
      .where('project_member.student_id', id)
    return result
  },

  getProjectsDetailById: async (id) => {
    const detail = await knex.select('*').from('projects').where('projects.id', id)
      .join('project_type', 'projects.project_type_id', 'project_type.id')
    const students = await knex('project_member').select('students.firstname_en', 'students.lastname_en')
      .join('students', 'project_member.student_id', 'students.student_id')
      .where('project_member.project_id', id)
    const tag = await knex.select('*').from('project_tags').where('project_id', id)
      .join('tags', 'project_tags.tag_id', 'tags.id')
    const achievement = await knex.select('*').from('project_achievement').where('project_id', id)
    const document = await knex.select('*').from('project_documents').where('project_id', id)
    const picture = await knex.select('*').from('project_pictures').where('project_id', id)
    const video = await knex.select('*').from('project_videos').where('project_id', id)

    const result = {
      'project_detail': detail[0],
      'students': students,
      'tag': tag,
      'achievement': achievement[0],
      'document': document,
      'picture': picture,
      'video': video
    }
    if (detail.haveOutsider === true) {
      const outsider = await knex.select('*').from('project_outsiders').where('project_id', id)
      result.outsider = outsider
    }
    console.log(result)
    return result
  },

  createProject: async (projectData) => {
    const projectTypeId = await knex('project_type').select('id').where('project_type_name', projectData.project_type_name)
    projectData.project_type_id = projectTypeId[0].id
    delete projectData.project_type_name
    const projectId = await knex('projects').insert(projectData)
    const project = await knex.select('*').from('projects').where('id', projectId)
    return project[0]
  },

  addProjectStudent: async (member) => {
    console.log(member)
    await knex('project_member').insert(member)
    const members = await knex.select('*').from('project_member').where('project_id', member[0].project_id)
    return members
  },

  addProjectAchievement: async (achieveData) => {
    await knex('project_achievement').insert(achieveData)
    const achievement = await knex.select('*').from('project_achievement').where('project_id', achieveData.project_id)
    return achievement
  },

  updateProject: async (id, data) => {
    const result = await knex('projects').update(data).where('id', id)
    return result
  },

  updateProjectCount: async (action, projectId) => {
    let count = 0
    let result = {}
    if (action === 'viewer') {
      count = await knex.select('count_viewer').from('projects').where('id', projectId)
      count++
      const data = {
        'count_viewer': count
      }
      result = await knex('projects').update(data).where('id', projectId)
    }

    if (action === 'clap') {
      count = await knex.select('count_clap').from('projects').where('id', projectId)
      count++
      const data = {
        'count_viewer': count
      }
      result = await knex('projects').update(data).where('id', projectId)
    }
    return result
  },

  deleteProject: async (id) => {
    await knex('project_tags').del().where('project_id', id)
    await knex('project_videos').del().where('project_id', id)
    await knex('project_pictures').del().where('project_id', id)
    await knex('project_documents').del().where('project_id', id)
    await knex('project_achievement').del().where('project_id', id)
    await knex('project_outsiders').del().where('project_id', id)
    await knex('project_member').del().where('project_id', id)
    await knex('projects').del().where('id', id)
  }

}
