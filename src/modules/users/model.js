const knex = require('../../db/knex')
const query = require('./constants')
module.exports = {

  getUserDefaultInformation: async (userRole, id) => {
    try {
      let result = {}
      if (userRole === 'student') {
        const profile = await knex('students').select(query.queryStudentDefaultInformation)
          .join('curriculum', 'students.curriculum_id', 'curriculum.id')
          .join('students_profile', 'students.student_id', 'students_profile.student_id')
          .where('students.student_id', id)
        result = {
          'profile': profile[0]
        }

        return result
      } else {
        result = await knex.select(query.queryLecturerDefaultInformation).from('lecturers')
          .join('lecturers_position', 'lecturers.position_id', 'lecturers_position.id')
          .where('lecturer_id', id)
        return result[0]
      }
    } catch (err) {
      throw new Error(err)
    }
  },

  updateUserEmail: async (userRole, id, email) => {
    try {
      let result
      if (userRole === 'student') {
        result = await knex('students').where('student_id', id).update('email', email)
      } else if (userRole === 'lecturer') {
        result = await knex('lecturers').where('lecturer_id', id).update('email', email)
      } else {
        throw new Error('Incorrect users role')
      }
      return result
    } catch (err) {
      throw new Error(err)
    }
  },

  updateUserImage: async (userRole, id, link) => {
    try {
      let result
      if (userRole === 'student') {
        result = await knex('students').where('student_id', id).update('profile_picture', link)
      } else if (userRole === 'lecturer') {
        result = await knex('lecturers').where('lecturer_id', id).update('profile_picture', link)
      } else {
        throw new Error('Incorrect users role')
      }
      return result
    } catch (err) {
      throw new Error(err)
    }
  },

  getUserImage: async (userRole, id) => {
    try {
      let result
      if (userRole === 'student') {
        result = await knex('students').select('profile_picture').where('student_id', id)
      } else if (userRole === 'lecturer') {
        result = await knex('lecturers').select('profile_picture').where('lecturer_id', id)
      } else {
        throw new Error('Incorrect users role')
      }
      return result[0].profile_picture
    } catch (err) {
      throw new Error(err)
    }
  },

  getStudentInformationById: async (id) => {
    try {
      let result = {}
      const profile = await knex('students').select(query.queryStudentInformation)
        .join('curriculum', 'students.curriculum_id', 'curriculum.id')
        .join('students_profile', 'students.student_id', 'students_profile.student_id')
        .where('students.student_id', id)
        .join('student_address', 'students_profile.id', 'student_address.students_profile_id')
      const languages = await knex.select(query.queryStudentLanguage).from('student_language').where('students_profile_id', profile[0].id)
        .join('languages', 'student_language.language_id', 'languages.id')
        .join('languages_level', 'student_language.level_id', 'languages_level.id')

      const education = await knex.select(query.queryStudentEducation).from('student_education').where('students_profile_id', profile[0].id)
        .join('education_level', 'student_education.education_level_id', 'education_level.id')

      result = {
        'profile': profile[0],
        'language': languages,
        'education': education
      }
      return result
    } catch (err) {
      throw new Error(err)
    }
  },

  updateStudentInformation: async (profile, address) => {
    try {
      const dataForStudentDB = {
        introduce_detail: profile.biology,
        university_gpa: profile.gpa,
        email: profile.email
      }
      const a = await knex('students').where('student_id', profile.student_id).update(dataForStudentDB)
      console.log('a', a)

      const dataForStudentProfileDB = {
        nickname: profile.nickname,
        birthday: profile.birthday,
        telephone_number: profile.telephone_number,
        gender: profile.gender
      }
      const b = await knex('students_profile').where('student_id', profile.student_id).update(dataForStudentProfileDB)
      console.log('b', b)

      const profileId = await knex('students_profile').select('id').where('student_id', profile.student_id)
      console.log('profileId', profileId[0].id)
      const c = await knex('student_address').where('id', profileId[0].id).update(address)
      console.log('c', c)

      return profileId[0].id
    } catch (err) {
      throw new Error(err)
    }
  },

  addUserLanguage: async (languages) => {
    try {
      await knex('student_language').insert(languages)
    } catch (err) {
      throw new Error(err)
    }
  },

  addUserEducation: async (educations) => {
    try {
      await knex('student_education').insert(educations)
    } catch (err) {
      throw new Error(err)
    }
  },

  updateUserEducation: async (education) => {
    try {
      await knex('student_education').update(education).where('id', education.id)
    } catch (err) {
      throw new Error(err)
    }
  },

  getEducationLevel: async () => {
    try {
      const list = await knex('education_level').select('id', 'level_name')
      return list
    } catch (err) {
      throw new Error(err)
    }
  },

  getLanguages: async () => {
    try {
      const list = await knex('languages').select('id', 'language_name')
      return list
    } catch (err) {
      throw new Error(err)
    }
  },

  getLanguagesLevel: async () => {
    try {
      const list = await knex('languages_level').select('id', 'level_name')
      return list
    } catch (err) {
      throw new Error(err)
    }
  },

  getListStudent: async (code) => {
    try {
      return await knex('students').select(query.queryListStudent).where('student_id', 'like', `${code}%`)
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
      const outsiders = await knex.select(query.queryProjectOutsider).from('project_outsiders').where('project_id', projectId)
      return outsiders
    } catch (err) {
      throw new Error(err)
    }
  },

  updateProjectOutsider: async (outsider) => {
    try {
      await knex('project_outsiders').where('id', outsider.id).update(outsider)
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
  },

  deleteUserLanguage: async (profileId) => {
    try {
      await knex('student_language').del().where('students_profile_id', profileId)
    } catch (err) {
      throw new Error(err)
    }
  },

  checkUser: async (role, userId) => {
    if (role === 'student') {
      const id = await knex('students').select('student_id').where('student_id', userId)
      return id.length > 0
    } else if (role === 'lecturer') {
      const id = await knex('lecturers').select('lecturer_id').where('lecturer_id', userId)
      return id.length > 0
    } else {
      throw new Error('Invalid role_ user')
    }
  },

  createUser: async (role, data, description) => {
    try {
      if (role === 'student') {
        const curriculumId = await knex('curriculum').select('id').where('curriculum_name', description)
        data.curriculum_id = curriculumId[0].id
        await knex('students').insert(data)
        const profileId = await knex('students_profile').insert({ student_id: data.student_id }).returning('id')
        await knex('student_address').insert({ students_profile_id: profileId[0] })
      } else if (role === 'lecturer') {

      }
    } catch (err) {
      throw new Error(err)
    }
  }
}
