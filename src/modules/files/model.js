const knex = require('../../db/knex')
module.exports = {

  createImage: async (image) => {
    try {
      await knex('project_images').insert(image)
    } catch (err) {
      throw new Error(err)
    }
  },
  createDocument: async (document) => {
    try {
      await knex('project_documents').insert(document)
    } catch (err) {
      throw new Error(err)
    }
  },

  createVideo: async (projectId) => {
    try {
      await knex('project_video').insert({ project_id: projectId })
    } catch (err) {
      throw new Error(err)
    }
  },

  deleteImage: async (path) => {
    try {
      await knex('project_images').del().where('path_name', 'like', `%${path}`)
    } catch (err) {
      throw new Error(err)
    }
  },

  deleteDocument: async (path) => {
    try {
      await knex('project_documents').del().where('path_name', 'like', `%${path}`)
    } catch (err) {
      throw new Error(err)
    }
  },

  getImage: async (projectId) => {
    try {
      const image = await knex.select('path_name').from('project_images').where('project_id', projectId)
      return image
    } catch (err) {
      throw new Error(err)
    }
  },

  getCoverImage: async (projectId) => {
    try {
      const image = await knex.select('path_name').from('project_images')
        .where('project_id', projectId)
        .andWhere('path_name', 'like', '%cover%')
      return image
    } catch (err) {
      throw new Error(err)
    }
  },

  getDocument: async (projectId) => {
    try {
      const document = await knex.select('path_name').from('project_documents').where('project_id', projectId)
      return document
    } catch (err) {
      throw new Error(err)
    }
  },

  getVideo: async (projectId) => {
    try {
      const video = await knex('project_video').select('path_name').where('project_id', projectId)
      return video[0]
    } catch (err) {
      throw new Error(err)
    }
  },

  updateVideo: async (video, projectId) => {
    try {
      await knex('project_video').update(video).where('project_id', projectId)
    } catch (err) {
      throw new Error(err)
    }
  }
}
