const joi = require('joi')

module.exports = {
  projectPageSchema: joi.object().keys({
    id: joi.number().required()
  }),

  createProjectSchema: joi.object().keys({
    project_data: joi.object().keys({
      project_name_th: joi.string().required().trim(),
      project_name_en: joi.string().required().trim(),
      project_type_name: joi.string().required().trim(),
      project_detail_th: joi.string().required().trim().allow(null),
      project_detail_en: joi.string().required().trim().allow(null),
      start_month: joi.number().required(),
      start_year_en: joi.number(),
      haveOutsider: joi.boolean().required()

    }),
    member: joi.object().keys({
      students: joi.array().required().items(
        joi.object().keys({
          student_id: joi.string().required().trim().length(11)
        })
      ),
      outsider: joi.array().items(
        joi.object().keys({
          firstname: joi.string().required().trim(),
          lastname: joi.string().required().trim(),
          email: joi.string().trim().email()
        })
      )
    }),
    achievement: joi.object().keys({
      achievement_name: joi.string().required().trim(),
      achievement_detail: joi.string().trim(),
      organize_by: joi.string().trim(),
      date_of_event: joi.string().trim()
    })
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
