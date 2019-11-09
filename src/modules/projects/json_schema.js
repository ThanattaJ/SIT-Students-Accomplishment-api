const joi = require('joi')

module.exports = {
  pageDefaultSchema: joi.object().keys({
    page: joi.string().required().trim()
  }),

  pageDefaultForAssignmentSchema: joi.object().keys({
    course_id: joi.number(),
    academic_term_id: joi.number()
  }),

  projectPageSchema: joi.object().keys({
    project_id: joi.number().required()
  }),

  createProjectSchema: joi.object().keys({
    project_data: joi.object().keys({
      project_name_th: joi.string().required().trim(),
      project_name_en: joi.string().required().trim(),
      project_type_name: joi.string().required().trim(),
      assignment_id: joi.number().allow(null),
      project_detail: joi.string().required().trim().allow(null),
      project_abstract: joi.string().required().trim().allow(null),
      start_month: joi.number(),
      start_year_en: joi.number().required(),
      end_month: joi.number(),
      end_year_en: joi.number().required(),
      haveOutsider: joi.boolean().required()

    }),
    member: joi.object().keys({
      students: joi.array().required().items(
        joi.object().keys({
          student_id: joi.string().trim()
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
    achievements: joi.array().items(
      joi.object().keys({
        achievement_name: joi.string().required().trim(),
        achievement_detail: joi.string().trim().allow(null),
        organize_by: joi.string().trim().allow(null),
        date_of_event: joi.string().trim().allow(null)
      })
    )
  }),

  updateProjectDetailSchema: joi.object().keys({
    project_detail: joi.object().keys({
      id: joi.number().required(),
      project_name_th: joi.string().required().trim(),
      project_name_en: joi.string().required().trim(),
      project_detail: joi.string().trim().allow(null),
      project_abstract: joi.string().trim().allow(null),
      project_type_name: joi.string().trim(),
      isShow: joi.boolean(),
      haveOutsider: joi.boolean(),
      tool_techniq_detail: joi.string().trim().allow(null),
      references: joi.string().trim().allow(null),
      count_viewer: joi.number(),
      count_clap: joi.number(),
      start_month: joi.number(),
      start_year_en: joi.number(),
      start_year_th: joi.number(),
      end_month: joi.number(),
      end_year_en: joi.number(),
      end_year_th: joi.number(),
      assignment_detail: joi.object().keys({
        assignment_id: joi.number().allow(null),
        assignment_name: joi.string().trim().allow(null),
        academic_term_id: joi.number().allow(null),
        academic_term: joi.string().trim().allow(null),
        course_id: joi.number().allow(null),
        course_name: joi.string().trim().allow(null),
        lecturers: joi.array().items(
          joi.object().keys({
            lecturer_id: joi.string().trim().allow(null),
            lecturer_name: joi.string().trim().allow(null)
          })
        ).allow(null),
        project_status: joi.string().trim().allow(null),
        comment: joi.string().trim().allow(null)
      })
    }).required(),
    students: joi.array().items(
      joi.object().keys({
        student_id: joi.string().trim(),
        firstname: joi.string().trim(),
        lastname: joi.string().trim(),
        email: joi.string().trim().email().allow(null)
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
    achievements: joi.array().items(
      joi.object().keys({
        project_id: joi.number(),
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

  updateClapSchema: joi.object().keys({
    project_id: joi.number().required()
  }),

  addExternalToAssignmentSchema: joi.object().keys({
    project_id: joi.number().required(),
    assignment_id: joi.number().required()
  }),

  projectIsGroupSchema: joi.object().keys({
    isGroup: joi.string().required().trim()
  })
}
