const knex = require('../../db/knex')
const { queryTagByChar } = require('./constants')
module.exports = {

  createTag: async (tagName) => {
    try {
      await knex('tags').insert({ 'tag_name': tagName })
      const tagId = await knex('tags').select('id as tag_id').where('tag_name', tagName)
      return tagId
    } catch (err) {
      throw new Error(err)
    }
  },

  checkTag: async (tagName) => {
    try {
      const tagId = await knex('tags').select('id as tag_id').where('tag_name', tagName)
      return tagId
    } catch (err) {
      throw new Error(err)
    }
  },

  getTagByChar: async (char) => {
    try {
      let tags
      if (char === 'all') {
        tags = await knex('tags').select(queryTagByChar).count('project_tags.project_id as count_tags')
          .join('project_tags', 'tags.id', 'project_tags.tag_id')
          .join('projects', 'project_tags.project_id', 'projects.id')
          .where('projects.isShow', true)
          .groupBy('project_tags.tag_id')
      } else {
        tags = await knex('tags').select(queryTagByChar).where('tag_name', 'like', `${char}%`)
      }
      return tags
    } catch (err) {
      throw new Error(err)
    }
  }
}
