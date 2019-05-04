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
      start_month: joi.number(),
      start_year_en: joi.number().required(),
      haveOutsider: joi.boolean().required()

    }),
    member: joi.object().keys({
      students: joi.array().required().items(
        joi.object().keys({
          student_id: joi.string().required().trim().length(11)
        })
      ),
      outsiders: joi.array().items(
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
    project_detail: joi.object().keys({
      id: joi.number().required(),
      project_name_th: joi.string().required().trim(),
      project_name_en: joi.string().required().trim(),
      project_detail_th: joi.string().trim().allow(null),
      project_detail_en: joi.string().trim().allow(null),
      project_type_name: joi.string().trim(),
      isShow: joi.boolean(),
      haveOutsider: joi.boolean(),
      tool_techniq_detail: joi.string().trim().allow(null),
      references: joi.string().trim().allow(null),
      count_viewer: joi.number(),
      count_clap: joi.number(),
      start_month: joi.number(),
      start_year_en: joi.number(),
      start_year_th: joi.number()
    }).required(),
    students: joi.array().items(
      joi.object().keys({
        student_id: joi.string().required().trim().length(11),
        firstname_en: joi.string().trim(),
        lastname_en: joi.string().trim(),
        email: joi.string().trim().email()
      })
    ),
    outsiders: joi.array().items(
      joi.object().keys({
        id: joi.number(),
        firstname: joi.string().trim(),
        lastname: joi.string().trim(),
        email: joi.string().trim().email().allow(null)
      })
    ),
    achievement: joi.array().items(
      joi.object().keys({
        achievement_name: joi.string().trim(),
        achievement_detail: joi.string().trim().allow(null),
        organize_by: joi.string().trim().allow(null),
        date_of_event: joi.string().trim().allow(null)
      })
    ),
    tags: joi.array().items(
      joi.object().keys({
        tag_id: joi.number(),
        tag_name: joi.string().trim()
      })
    ),
    document: joi.array().items(
      joi.object().keys({
        path_name: joi.string().trim()
      })
    ),
    picture: joi.array().items(
      joi.object().keys({
        path_name: joi.string().trim()
      })
    ),
    video: joi.object().keys({
      path_name: joi.string().trim().allow(null)
    })
  }),

  updateCountingSchema: joi.object().keys({
    action: joi.string().required().trim(),
    id: joi.number().required()
  })
}
