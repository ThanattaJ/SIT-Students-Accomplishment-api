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
    detail: joi.string().trim().allow(null),
    isDelete: joi.boolean()
  }),

  deleteCourseSchema: joi.object().keys({
    id: joi.number().required()
  }),

  getCourseSemester: joi.object().keys({
    semester_id: joi.number()
  }),

  addCourseSemesterSchema: joi.object().keys({
    academic_term_id: joi.number().required(),
    course_id: joi.number().required(),
    lecturers: joi.array().items(
      joi.object().keys({
        lecturer_id: joi.string().required().trim()
      })
    )
  }),

  updateCourseSemesterSchema: joi.object().keys({
    academic_term_id: joi.number().required(),
    course_id: joi.number().required(),
    lecturers: joi.array().items(
      joi.object().keys({
        course_map_lecturer: joi.number(),
        lecturer_id: joi.string().required().trim()
      })
    )
  }),

  deleteCourseSemesterSchema: joi.object().keys({
    academic_term_id: joi.number().required(),
    course_id: joi.number().required()
  })
}
