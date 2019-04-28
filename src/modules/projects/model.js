const knex = require('../../db/knex')
const filesModel = require('../files/model')
const query = require('./constants')
module.exports = {

  getAllProjects: async () => {
    try {
      const result = await knex.select(query.queryAllProjects).from('projects').where('isShow', true)
      result.forEach(async project => {
        const cover = await filesModel.getCoverImage(project.id)
        project.cover_path = cover
      })

      return result
    } catch (err) {
      throw new Error(err)
    }
  },

  getProjectsByStudentId: async (id) => {
    try {
      const projects = await knex('projects').select(query.queryProjectsByStudentId)
        .join('project_member', 'projects.id', 'project_member.project_id')
        .where('project_member.student_id', id)

      projects.forEach(async project => {
        const cover = await filesModel.getCoverImage(project.id)
        project.cover_path = cover
      })
      return projects
    } catch (err) {
      throw new Error(err)
    }
  },

  countProjectUser: async (id) => {
    try {
      const total = await knex('projects').count('id as total')
        .join('project_member', 'projects.id', 'project_member.project_id')
        .where('project_member.student_id', id)
      return total[0].total
    } catch (err) {
      throw new Error(err)
    }
  },

  getProjectsDetailById: async (id) => {
    try {
      const detail = await knex.select(query.queryProjectsDetailById).from('projects').where('projects.id', id)
        .join('project_type', 'projects.project_type_id', 'project_type.id')
      const students = await knex('project_member').select(query.queryProjectStudentsMember)
        .join('students', 'project_member.student_id', 'students.student_id')
        .where('project_member.project_id', id)
      const achievement = await getAchievement(id)

      const tag = await knex.select(query.queryProjectTags).from('project_tags').where('project_id', id)
        .join('tags', 'project_tags.tag_id', 'tags.id')
      const document = await filesModel.getDocument(id)
      const image = await filesModel.getImage(id)
      const video = await filesModel.getVideo(id)
      delete detail[0].project_type_id
      const result = {
        'project_detail': detail[0],
        'students': students,
        'achievement': achievement[0] === undefined ? [] : achievement,
        'tags': tag,
        'document': document,
        'picture': image,
        'video': video
      }
      return result
    } catch (err) {
      throw new Error(err)
    }
  },

  createProject: async (projectData) => {
    try {
      const projectDataNew = await getProjectTypeId(projectData)
      const projectId = await knex('projects').insert(projectDataNew)
      await filesModel.createVideo(projectId)
      const project = await knex.select('*').from('projects').where('id', projectId)
      return project[0]
    } catch (err) {
      throw new Error(err)
    }
  },

  addProjectStudent: async (member) => {
    try {
      await knex('project_member').insert(member)
    } catch (err) {
      throw new Error(err)
    }
  },

  addProjectAchievement: async (achievementData) => {
    try {
      await insertAchievement(achievementData)
    } catch (err) {
      throw new Error(err)
    }
  },

  updateProjectDetail: async (id, projectDetail, achievementData) => {
    try {
      if (projectDetail.project_type_name) {
        projectDetail = await getProjectTypeId(projectDetail)
      }
      await knex('projects').update(projectDetail).where('id', id)
    } catch (err) {
      return err
    }
  },

  updateProjectAchievement: async (id, achievementData) => {
    try {
      const achievement = await getAchievement(id)
      if (achievement[0] === undefined) {
        achievementData.project_id = id
        await insertAchievement(achievementData)
      } else {
        await knex('project_achievement').update(achievementData).where('project_id', id)
      }
    } catch (err) {
      return err
    }
  },

  updateProjectCount: async (action, projectId) => {
    try {
      let count = {}
      if (action === 'viewer') {
        count = await knex('projects').select('count_viewer').where('id', projectId)
        count[0].count_viewer++
        await knex('projects').update(count[0]).where('id', projectId)
      }

      if (action === 'clap') {
        count = await knex('projects').select('count_clap').where('id', projectId)
        count[0].count_clap++
        await knex('projects').update(count[0]).where('id', projectId)
      }
      return count[0]
    } catch (err) {
      throw new Error(err)
    }
  },

  updateProjectTag: async (tag, projcetId) => {
    try {
      await knex('project_tags').del().where('project_id', projcetId)
      const result = knex('project_tags').insert(tag)
      return result
    } catch (err) {
      throw new Error(err)
    }
  },

  deleteProject: async (id) => {
    try {
      await knex('project_tags').del().where('project_id', id)
      await knex('project_video').del().where('project_id', id)
      await knex('project_images').del().where('project_id', id)
      await knex('project_documents').del().where('project_id', id)
      await knex('project_achievement').del().where('project_id', id)
      await knex('project_outsiders').del().where('project_id', id)
      await knex('project_member').del().where('project_id', id)
      await knex('projects').del().where('id', id)
    } catch (err) {
      throw new Error(err)
    }
  }

}

async function getProjectTypeId (projectData) {
  try {
    const projectTypeId = await knex('project_type').select('id').where('project_type_name', projectData.project_type_name)
    projectData.project_type_id = projectTypeId[0].id
    delete projectData.project_type_name
    return projectData
  } catch (err) {
    throw new Error(err)
  }
}

async function insertAchievement (achievementData) {
  try {
    await knex('project_achievement').insert(achievementData)
  } catch (err) {
    throw new Error(err)
  }
}

async function getAchievement (projectId) {
  try {
    const achievement = await knex.select(query.queryProjectAchievement).from('project_achievement').where('project_id', projectId)
    return achievement
  } catch (err) {
    throw new Error(err)
  }
}
