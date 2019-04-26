const joi = require('joi')

module.exports = {
  getTagByCharacterSchema: joi.object().keys({
    character: joi.string().required().trim()
  })
}
