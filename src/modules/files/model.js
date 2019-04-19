const knex = require('../../db/knex')
module.exports = {

  createImage: async (image) => { await knex('project_images').insert(image) },
  createDocument: async (document) => { await knex('project_documents').insert(document) },
  createVideo: async (projectId) => { await knex('project_video').insert({ project_id: projectId }) },

  deleteImage: async (path) => { await knex('project_images').del().where('path_name', 'like', `%${path}`) },
  deleteDocument: async (path) => { await knex('project_documents').del().where('path_name', 'like', `%${path}`) },

  getImage: async (projectId) => {
    const image = await knex.select('path_name').from('project_images').where('project_id', projectId)
    return image
  },
  getCoverImage: async (projectId) => {
    const image = await knex.select('path_name').from('project_images')
      .where('project_id', projectId)
      .andWhere('path_name', 'like', '%cover%')
    return image
  },
  getDocument: async (projectId) => {
    const document = await knex.select('path_name').from('project_documents').where('project_id', projectId)
    return document
  },
  getVideo: async (projectId) => {
    const video = await knex('project_video').select('path_name').where('project_id', projectId)
    return video[0]
  },

  updateVideo: async (video, projectId) => { await knex('project_video').update(video).where('project_id', projectId) }
}
