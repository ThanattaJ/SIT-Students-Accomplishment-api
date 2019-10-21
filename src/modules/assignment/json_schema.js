const joi = require('joi')

module.exports = {
  createAssignmentSchema: joi.object().keys({
    academic_term_id: joi.number().required(),
    course_id: joi.number().required(),
    assignment_name: joi.string().required().trim(),
    assignment_detail: joi.string().trim()
  }),

  getAssignmentsDetailByIdSchema: joi.object().keys({
    assignment_id: joi.number().required()
  }),

  getListAssignmentSpecifyCourseSchema: joi.object().keys({
    course_id: joi.number().required()
  }),

  updateLecturerApproverSchema: joi.object().keys({
    assignment_id: joi.number().required(),
    lecturer_course_id: joi.number().required(),
    isApprove: joi.boolean().required()
  }),

  updateAssignmentSchema: joi.object().keys({
    assignment_id: joi.number().required(),
    assignment_detail: joi.string().required().allow(null)
  }),

  joinAssignmentSchema: joi.object().keys({
    join_code: joi.string().required().trim()
  }),

  getAssignmentProjectByStudentIdSchema: joi.object().keys({
    isHave: joi.string().required().trim()
  }),

  getProjectRequestSchema: joi.object().keys({
    assignment_id: joi.number(),
    status: joi.string().trim()
  }),

  updateProjectStatusSchema: joi.object().keys({
    assignment_id: joi.number().required(),
    project_id: joi.number().required(),
    status: joi.string().trim(),
    comment: joi.string().trim().allow(null)
  })

}
