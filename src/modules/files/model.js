const knex = require('../../db/knex')
module.exports = {
  createVideo: async (projectId) => { await knex('project_video').insert({ project_id: projectId }) },

  getVideo: async (projectId) => {
    const video = await knex('project_video').select('path_name').where('project_id', projectId)
    return video[0]
  },

  updateVideo: async (video, projectId) => { await knex('project_video').update(video).where('project_id', projectId) }
}
