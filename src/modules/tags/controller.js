const tagModel = require('./model')
module.exports = {

  createTag: async (tagName) => {
    const tagId = await tagModel.createTag(tagName)
    return tagId
  }
}
