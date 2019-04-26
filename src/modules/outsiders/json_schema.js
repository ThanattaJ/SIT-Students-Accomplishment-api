const joi = require('joi')

module.exports = {
  deleteOutsiderSchema: joi.object().keys({
    id: joi.number().required()
  })
}
