const tagModel = require('./model')
const { validate } = require('../validation')
const { getTagByCharacterSchema } = require('./json_schema')

module.exports = {

  createTag: async (tagName) => {
    try {
      const tagId = await tagModel.createTag(tagName)
      return tagId
    } catch (err) {
      throw new Error(err)
    }
  },

  checkTag: async (tagName) => {
    try {
      const tagId = await tagModel.checkTag(tagName)
      return tagId
    } catch (err) {
      throw new Error(err)
    }
  },

  getTagByCharacter: async (req, res) => {
    try {
      const { checkStatus, err } = validate(req.params, getTagByCharacterSchema)
      if (!checkStatus) return res.send(err)

      const char = req.params.character
      const tags = await tagModel.getTagByChar(char)
      res.send(tags)
    } catch (err) {
      res.status(500).send({
        status: 500,
        message: err.message
      })
    }
  }
}
