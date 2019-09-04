const joi = require('joi')

module.exports = {
  getUserIdSchema: joi.object().keys({
    user_role: joi.string().required().trim(),
    id: joi.string().required().trim().length(11)
  }),

  getStudentIdSchema: joi.object().keys({
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

  updateStudentIdSchema: joi.object().keys({
    profile: joi.object().keys({
      id: joi.number().required(),
      student_id: joi.string().required().trim().length(11),
      biology: joi.string().trim().allow(null),
      firstname: joi.string().required().trim(),
      lastname: joi.string().required().trim(),
      gpa: joi.number().allow(null),
      email: joi.string().trim().email(),
      nickname: joi.string().trim(),
      birthday: joi.date(),
      telephone_number: joi.string().trim().allow(null),
      gender: joi.string().trim().allow(null)
    }).required(),
    address: joi.object().keys({
      description: joi.string().trim().allow(null),
      district: joi.string().trim().allow(null),
      subdistrict: joi.string().trim().allow(null),
      province: joi.string().trim().allow(null),
      postcode: joi.string().trim().allow(null)
    }).required(),
    languages: joi.array().items(
      joi.object().keys({
        language_id: joi.number().required(),
        level_id: joi.number().required()
      })
    ),
    educations: joi.array().items(
      joi.object().keys({
        id: joi.number(),
        education_level_id: joi.number().required(),
        school_name: joi.string().trim().required(),
        program: joi.string().trim().allow(null),
        gpa: joi.number().allow(null),
        start_year: joi.number().allow(null),
        end_year: joi.number().allow(null)
      })
    )
  }),

  getListStudentSchema: joi.object().keys({
    code: joi.number().required().positive()
  }),

  deleteOutsiderSchema: joi.object().keys({
    outsider_id: joi.number().required()
  })
}
