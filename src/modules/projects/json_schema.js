const joi = require('joi')

module.exports = {
  projectPageSchema: joi.object().keys({
    id: joi.number().required()
  }),

  createProjectSchema: joi.object().keys({
    action: joi.string().required().trim(),
    id: joi.number().required()
  }),

  updateProjectDetailSchema: joi.object().keys({
    action: joi.string().required().trim(),
    id: joi.number().required()
  }),

  updateCountingSchema: joi.object().keys({
    action: joi.string().required().trim(),
    id: joi.number().required()
  })
}
