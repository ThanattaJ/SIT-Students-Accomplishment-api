const joi = require('joi')

module.exports = {
  getUserIdSchema: joi.object().keys({
    user_role: joi.string().required().trim(),
    id: joi.string().required().trim().length(11)
  }),

  updateUserEmailSchema: joi.object().keys({
    user_role: joi.string().required().trim(),
    id: joi.string().required().trim().length(11),
    email: joi.string().required().trim()
  }),

  updateUserImageSchema: joi.object().keys({
    user_role: joi.string().required().trim(),
    id: joi.string().required().trim()
  }),

  getListStudentSchema: joi.object().keys({
    code: joi.number().required().positive()
  }),

  deleteOutsiderSchema: joi.object().keys({
    outsider_id: joi.number().required()
  })
}
