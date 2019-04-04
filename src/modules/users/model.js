const knex = require('../../db/knex')
const projectModel = require('../projects/controller')
module.exports = {

  getUserById: async (userRole, id) => {
    let result = {}
    if (userRole === 'student') {
      const profile = await knex.select('*').from('students').where('students.student_id', id)
        .join('curriculum', 'students.curriculum_id', 'curriculum.id')
        .join('students_profile', 'students.student_id', 'students_profile.student_id')
        .join('student_address_en', 'students_profile.id', 'student_address_en.students_profile_id')
        .join('student_address_th', 'students_profile.id', 'student_address_en.students_profile_id')
      const languages = await knex.select('*').from('student_language').where('students_profile_id', profile[0].students_profile_id)
        .join('languages_level', 'student_language.level_id', 'languages_level.id')

      const education = await knex.select('*').from('student_education').where('students_profile_id', profile[0].students_profile_id)
        .join('education_level', 'student_education.education_level_id', 'education_level.id')

      result = {
        'profile': profile,
        'language': languages,
        'education': education
      }

      return result
    } else {
      result = await knex.select().from('lecturer').where('lecturer_id', id)
      return result
    }
  },

  countProjectUser: async (id) => {
    const total = await knex('projects').count('id as total')
      .join('project_member', 'projects.id', 'project_member.project_id')
      .where('project_member.student_id', id)
    return total[0].total
  }
}
