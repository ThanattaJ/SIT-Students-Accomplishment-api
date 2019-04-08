const knex = require('../../db/knex')
module.exports = {

  createTag: async (tagName) => {
    await knex('tags').insert(tagName)
    const name = tagName.map(tag => tag.tag_name)
    const tagId = await knex('tags').select('id as tag_id').whereIn('tag_name', name)
    return tagId
  }
}
