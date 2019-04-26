const joi = require('joi')

module.exports = {
  deleteSchema: joi.object().keys({
    path_name: joi.string().required().trim()
  }),

  getCoverSchema: joi.object().keys({
    project_id: joi.number().required()
  }),

  uploadImgSchema: joi.object().keys({
    project_id: joi.string().required().trim(),
    isCover: joi.string().required().trim()
  }),

  uploadDocSchema: joi.object().keys({
    project_id: joi.string().required().trim()
  })
}
