const knex = require('../../db/knex')
const { queryStudentInformation, queryStudentLanguage, queryStudentEducation, queryListStudent, queryProjectOutsider } = require('./constants')
module.exports = {

  getUserById: async (userRole, id) => {
    try {
      let result = {}
      if (userRole === 'student') {
        const profile = await knex('students').select(queryStudentInformation)
          .join('curriculum', 'students.curriculum_id', 'curriculum.id')
          .join('students_profile', 'students.student_id', 'students_profile.student_id')
          .where('students.student_id', id)
          .join('student_address', 'students_profile.id', 'student_address.students_profile_id')
        const languages = await knex.select(queryStudentLanguage).from('student_language').where('students_profile_id', profile[0].id)
          .join('languages', 'student_language.language_id', 'languages.id')
          .join('languages_level', 'student_language.level_id', 'languages_level.id')

        const education = await knex.select(queryStudentEducation).from('student_education').where('students_profile_id', profile[0].id)
          .join('education_level', 'student_education.education_level_id', 'education_level.id')

        result = {
          'profile': profile[0],
          'language': languages,
          'education': education
        }

        return result
      } else {
        result = await knex.select().from('lecturer').where('lecturer_id', id)
        return result
      }
    } catch (err) {
      throw new Error(err)
    }
  },

  getListStudent: async (code) => {
    try {
      return await knex('students').select(queryListStudent).where('student_id', 'like', `${code}%`)
    } catch (err) {
      throw new Error(err)
    }
  },

  addProjectOutsider: async (outsiders) => {
    try {
      await knex('project_outsiders').insert(outsiders)
    } catch (err) {
      throw new Error(err)
    }
  },

  getProjectOutsider: async (projectId) => {
    try {
      const outsiders = await knex.select(queryProjectOutsider).from('project_outsiders').where('project_id', projectId)
      return outsiders
    } catch (err) {
      throw new Error(err)
    }
  },

  updateProjectOutsider: async (outsider) => {
    try {
      await knex('project_outsiders').where('id', outsider.id)
    } catch (err) {
      throw new Error(err)
    }
  },

  deleteOutsider: async (id) => {
    try {
      await knex('project_outsiders').del().where('id', id)
    } catch (err) {
      throw new Error(err)
    }
  }
}
