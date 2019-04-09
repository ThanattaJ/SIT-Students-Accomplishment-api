const tagModel = require('./model')
module.exports = {

  createTag: async (tagName) => {
    const tagId = await tagModel.createTag(tagName)
    return tagId
  },

  getTagByCharacter: async (req, res) => {
    const char = req.params.character
    const tags = await tagModel.getTagByChar(char)
    res.send(tags)
  }
}
