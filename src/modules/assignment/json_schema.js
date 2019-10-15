const joi = require('joi')

module.exports = {
  queryCreateAssignmentSchema: joi.object().keys({
    lecturer_course_id: joi.number().required(),
    academic_term_id: joi.number().required(),
    course_id: joi.number().required(),
    assignment_name: joi.string().required().trim()
  }),

  queryGetAssignmentByIdSchema: joi.object().keys({
    assignment_id: joi.number().required()
  }),

  queryUpdateLecturerApproverSchema: joi.object().keys({
    assignment_id: joi.number().required(),
    lecturer_course_id: joi.number().required(),
    isApprove: joi.boolean().required()
  })
}
