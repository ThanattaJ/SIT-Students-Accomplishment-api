const knex = require('../../db/knex')
const { queryPathName } = require('./constants')
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
      await knex('project_images').del().where(queryPathName, 'like', `%${path}`)
    } catch (err) {
      throw new Error(err)
    }
  },

  deleteDocument: async (path) => {
    try {
      await knex('project_documents').del().where(queryPathName, 'like', `%${path}`)
    } catch (err) {
      throw new Error(err)
    }
  },

  getImage: async (projectId) => {
    try {
      const image = await knex.select(queryPathName).from('project_images').where('project_id', projectId)
      return image
    } catch (err) {
      throw new Error(err)
    }
  },

  getCoverImage: async (projectId) => {
    try {
      const image = await knex.select(queryPathName).from('project_images')
        .where('project_id', projectId)
        .andWhere(queryPathName, 'like', '%cover%')
      return image
    } catch (err) {
      throw new Error(err)
    }
  },

  getDocument: async (projectId) => {
    try {
      const document = await knex.select(queryPathName).from('project_documents').where('project_id', projectId)
      return document
    } catch (err) {
      throw new Error(err)
    }
  },

  getVideo: async (projectId) => {
    try {
      const video = await knex('project_video').select(queryPathName).where('project_id', projectId)
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
