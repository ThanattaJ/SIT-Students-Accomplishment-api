const joi = require('joi')

module.exports = {
  getUserIdSchema: joi.object().keys({
    user_role: joi.string().required().trim(),
    user_id: joi.string().required().trim()
  }),

  getStudentIdSchema: joi.object().keys({
    id: joi.string().required().trim()
  }),

  updateUserEmailSchema: joi.object().keys({
    email: joi.string().required().trim()
  }),

  updateStudentIdSchema: joi.object().keys({
    profile: joi.object().keys({
      biology: joi.string().trim().allow(null),
      firstname: joi.string().trim(),
      lastname: joi.string().trim(),
      email: joi.string().trim().email(),
      nickname: joi.string().trim(),
      birthday: joi.date().allow(null),
      telephone_number: joi.string().trim().allow(null)
    }).required(),
    address: joi.object().keys({
      description: joi.string().trim().allow(null),
      district: joi.string().trim().allow(null),
      subdistrict: joi.string().trim().allow(null),
      province: joi.string().trim().allow(null),
      postcode: joi.string().trim().allow(null)
    }).required()
  }),

  updateStudentLanguageSchema: joi.object().keys({
    languages: joi.array().items(
      joi.object().keys({
        language_id: joi.number().required(),
        level_id: joi.number().required(),
        language_name: joi.string(),
        level_name: joi.string()
      })
    )
  }),

  updateStudentSkillSchema: joi.object().keys({
    skills: joi.array().items(
      joi.object().keys({
        skill_name: joi.string().required(),
        skill_level_id: joi.number().required(),
        level_name: joi.string()
      })
    )
  }),

  updateStudentEducationSchema: joi.object().keys({
    educations: joi.array().items(
      joi.object().keys({
        education_level_id: joi.number().required(),
        level_name: joi.string().trim(),
        school_name: joi.string().trim().required(),
        program: joi.string().trim().allow(null),
        gpa: joi.number().allow(null),
        start_year: joi.string().allow(null),
        end_year: joi.string().allow(null)
      })
    )
  }),

  updateStudentSocialSchema: joi.object().keys({
    social: joi.object().keys({
      Twitter: joi.string().allow(null),
      Facebook: joi.string().allow(null),
      Instagram: joi.string().allow(null),
      Linkedin: joi.string().allow(null),
      Github: joi.string().allow(null),
      Pinterest: joi.string().allow(null),
      Vimeo: joi.string().allow(null),
      Tumblr: joi.string().allow(null),
      Flickr: joi.string().allow(null),
      Link: joi.string().allow(null)
    })
  }),

  getListStudentSchema: joi.object().keys({
    code: joi.string().required()
  }),

  deleteOutsiderSchema: joi.object().keys({
    outsider_id: joi.number().required()
  })
}
