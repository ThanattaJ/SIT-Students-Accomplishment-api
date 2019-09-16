const joi = require('joi')

module.exports = {
  createCourseSchema: joi.object().keys({
    code: joi.string().required().trim(),
    name: joi.string().required().trim(),
    detail: joi.string().trim().allow(null)
  }),

  updateCourseSchema: joi.object().keys({
    code: joi.string().required().trim(),
    name: joi.string().required().trim(),
    detail: joi.string().trim().allow(null)
  })

}
