const knex = require('../../db/knex')
const filesModel = require('../files/model')
const query = require('./constants')

const getProjectsCover = async (projects) => {
  const getProjects = async _ => {
    const promises = projects.map(async project => {
      const cover = await filesModel.getCoverImage(project.id)
      project.cover_path = cover[0] ? cover[0].path_name : null
      const assignment = await knex('project_assignment').select().where('project_id', project.id)
      project.assignment = !!assignment[0]
    })
    await Promise.all(promises)
  }
  await getProjects()
  return projects
}

module.exports = {
  getAllYearProject: async () => {
    const year = await knex.raw('SELECT DISTINCT YEAR (created_at) year FROM projects ORDER BY year DESC')
    return year[0]
  },

  getTopProject: async () => {
    let projects = await knex('projects').select(query.queryAllProjects)
      .where('isShow', true)
      .orderBy('projects.count_viewer', 'desc')
      .limit(5)
    projects = await getProjectsCover(projects)
    return projects
  },

  getAllProjects: async (year) => {
    try {
      let projects
      if (year === 'all') {
        projects = await knex.select(query.queryAllProjects).from('projects')
          .where('isShow', true)
          .orderBy('projects.count_viewer', 'desc')
          .limit(40)
        projects = await getProjectsCover(projects)
      } else {
        projects = await knex.select(query.queryAllProjects).from('projects')
          .where('isShow', true)
          .andWhere('created_at', 'like', `${year}%`)
          .orderBy('projects.count_viewer', 'desc')
          .limit(4)
        const topProjectId = projects.map(project => project.id)
        const unTopProject = await knex('projects').select(query.queryAllProjects)
          .whereNotIn('id', topProjectId)
          .andWhere('isShow', true)
          .andWhere('created_at', 'like', `${year}%`)
          .orderBy('projects.created_at', 'desc')
        projects = projects.concat(unTopProject)
        projects = await getProjectsCover(projects)
      }
      return projects
    } catch (err) {
      throw new Error(err)
    }
  },

  getProjectByTag: async (tagCharacter, year) => {
    try {
      let projects = await knex.select(query.queryAllProjects).from('projects').distinct('projects.id')
        .join('project_tags', 'projects.id', 'project_tags.project_id')
        .join('tags', 'project_tags.tag_id', 'tags.id')
        .where('tags.tag_name', 'like', `%${tagCharacter}%`)
        .andWhere('projects.isShow', true)
      projects = await getProjectsCover(projects)
      return projects
    } catch (err) {
      throw new Error(err)
    }
  },

  getProjectByName: async (nameCharacter, year) => {
    try {
      let projects = await knex.select(query.queryAllProjects).from('projects').distinct('projects.id')
        .where('projects.project_name_th', 'like', `%${nameCharacter}%`)
        .orWhere('projects.project_name_en', 'like', `%${nameCharacter}%`)
        .andWhere('projects.isShow', true)
      projects = await getProjectsCover(projects)
      return projects
    } catch (err) {
      throw new Error(err)
    }
  },

  getProjectsByStudentId: async (access, id) => {
    try {
      let projects
      if (access === true) {
        projects = await knex('projects').select(query.queryProjectsByStudentId).distinct('projects.id')
          .join('project_member', 'projects.id', 'project_member.project_id')
          .leftJoin('project_assignment', 'projects.id', 'project_assignment.project_id')
          .leftJoin('assignments', 'project_assignment.assignment_id', 'assignments.id')
          .leftJoin('status_project', 'project_assignment.status_id', 'status_project.id')
          .where('project_member.student_id', id)
          .orderBy('projects.created_at', 'desc')
      } else {
        projects = await knex('projects').select(query.queryProjectsByStudentId)
          .join('project_member', 'projects.id', 'project_member.project_id')
          .leftJoin('project_assignment', 'projects.id', 'project_assignment.project_id')
          .leftJoin('assignments', 'project_assignment.assignment_id', 'assignments.id')
          .leftJoin('status_project', 'project_assignment.status_id', 'status_project.id')
          .where('project_member.student_id', id)
          .andWhere('isShow', true)
          .orderBy('projects.count_viewer', 'desc')
          .limit(4)
        const topProjectId = projects.map(project => project.id)
        const unTopProject = await knex('projects').select(query.queryProjectsByStudentId)
          .join('project_member', 'projects.id', 'project_member.project_id')
          .leftJoin('project_assignment', 'projects.id', 'project_assignment.project_id')
          .leftJoin('assignments', 'project_assignment.assignment_id', 'assignments.id')
          .leftJoin('status_project', 'project_assignment.status_id', 'status_project.id')
          .whereNotIn('projects.id', topProjectId)
          .andWhere('project_member.student_id', id)
          .andWhere('projects.isShow', true)
          .orderBy('projects.created_at', 'desc')
        projects = projects.concat(unTopProject)
      }
      projects = await getProjectsCover(projects)
      return projects
    } catch (err) {
      throw new Error(err)
    }
  },

  countProjectByYear: async (id) => {
    try {
      const total = await knex('projects').select(query.queryCountProjectByYear).count('id as total')
        .join('project_member', 'projects.id', 'project_member.project_id')
        .where('project_member.student_id', id)
        .groupBy('projects.start_year_en')
      return total
    } catch (err) {
      throw new Error(err)
    }
  },

  countTagForAllProject: async (allProjectId) => {
    try {
      const allTag = await knex('project_tags').select('tags.tag_name').count('project_tags.tag_id as total_tag')
        .join('tags', 'tag_id', 'tags.id')
        .whereIn('project_tags.project_id', allProjectId)
        .groupBy('tags.tag_name')
        .orderBy('tags.tag_name')
      return allTag
    } catch (err) {
      throw new Error(err)
    }
  },

  getProjectsDetailById: async (id) => {
    try {
      const detail = await knex.select(query.queryProjectsDetailById).from('projects').where('projects.id', id)
        .join('project_type', 'projects.project_type_id', 'project_type.id')
        .leftJoin('project_assignment', 'projects.id', 'project_assignment.project_id')
        .leftJoin('status_project', 'project_assignment.status_id', 'status_project.id')
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
        'achievements': achievement[0] === undefined ? [] : achievement,
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

  getShortProjectDetailById: async (id) => {
    const detail = await knex.select(query.queryProjectsDetailById).from('projects').where('projects.id', id)
      .join('project_type', 'projects.project_type_id', 'project_type.id')
      .leftJoin('project_assignment', 'projects.id', 'project_assignment.project_id')
      .leftJoin('status_project', 'project_assignment.status_id', 'status_project.id')
    const students = await knex('project_member').select(query.queryProjectStudentsMember)
      .join('students', 'project_member.student_id', 'students.student_id')
      .where('project_member.project_id', id)
    const result = {
      'project_detail': detail[0],
      'students': students
    }
    return result
  },

  createProject: async (projectData) => {
    try {
      const projectDataNew = await getProjectTypeId(projectData)
      const projectId = await knex('projects').insert(projectDataNew)
      await filesModel.createVideo(projectId)
      return projectId[0]
    } catch (err) {
      throw new Error(err)
    }
  },

  mapProjectAndAssignment: async (projectId, assignmentId, status) => {
    try {
      let id
      const statusId = await knex('status_project').select('id').where('status_name', 'Waiting')
      if (status === 'create') {
        const data = {
          project_id: projectId,
          assignment_id: assignmentId,
          status_id: statusId[0].id
        }
        id = await knex('project_assignment').insert(data).returning('id')
      } else if (status === 'update') {
        const statusId = await knex('status_project').select('id').where('status_name', 'Waiting')
        id = await knex('project_assignment').update('status_id', statusId[0].id)
          .where('project_id', projectId)
          .andWhere('assignment_id', assignmentId)
          .returning('id')
      }
      return id
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

  manageProjectAchievement: async (projectId, achievementData) => {
    try {
      await knex('project_achievement').del().where('project_id', projectId)
      achievementData.forEach(achievement => {
        achievement.project_id = projectId
      })
      await insertAchievement(achievementData)
    } catch (err) {
      return err
    }
  },

  updateProjectCouting: async (action, projectId) => {
    try {
      const count = await knex('projects').select(`count_${action}`).where('id', projectId)
      count[0][`count_${action}`]++
      await knex('projects').update(count[0]).where('id', projectId)
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
  },
  getProjectsCover,

  getProjectIsGroup: async (studentId, isGroup) => {
    try {
      const projects = await knex('projects').select(query.queryAllProjects)
        .join('project_member', 'projects.id', 'project_member.project_id')
        .leftJoin('project_assignment', 'projects.id', 'project_assignment.project_id')
        .whereNull('project_assignment.project_id')
        .andWhere('projects.isGroup', isGroup)
        .andWhere('project_member.student_id', studentId)
      return projects
    } catch (err) {
      throw new Error(err)
    }
  },

  getProjectFilterTagByStudentId: async (studentId, tag) => {
    try {
      let projects = await knex('projects').select(query.queryAllProjects)
        .join('project_member', 'projects.id', 'project_member.project_id')
        .join('project_tags', 'projects.id', 'project_tags.project_id')
        .join('tags', 'project_tags.tag_id', 'tags.id')
        .where('project_member.student_id', studentId)
        .andWhere('tags.tag_name', tag)
      projects = await getProjectsCover(projects)
      return projects
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
