const knex = require('../../db/knex')
const { queryTagByChar } = require('./constants')
module.exports = {

  createTag: async (tagName) => {
    try {
      await knex('tags').insert(tagName)
      const name = tagName.map(tag => tag.tag_name)
      const tagId = await knex('tags').select('id as tag_id').whereIn('tag_name', name)
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
