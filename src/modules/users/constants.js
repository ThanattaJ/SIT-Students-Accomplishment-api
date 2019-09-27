module.exports = {
  queryStudentDefaultInformation: [
    'students.id',
    'students.student_id',
    'students.firstname',
    'students.lastname',
    'students.email',
    'students.profile_picture',
    'students.viwer',
    'students.resume_gen_count',
    'curriculum.curriculum_name',
    'students_profile.nickname'
  ],
  queryLecturerDefaultInformation: [
    'lecturers.id',
    'lecturers.lecturer_id',
    'lecturers.firstname',
    'lecturers.lastname',
    'lecturers.email',
    'lecturers.profile_picture',
    'lecturers_position.position_name'
  ],

  queryStudentInformation: [
    'students.id',
    'students.student_id',
    'students.introduce_detail',
    'students.firstname',
    'students.lastname',
    'students.email',
    'students.profile_picture',
    'curriculum.curriculum_name',
    'students_profile.nickname',
    'students_profile.birthday',
    'students_profile.telephone_number',
    'student_address.description',
    'student_address.district',
    'student_address.subdistrict',
    'student_address.province',
    'student_address.postcode'
  ],

  queryStudentLanguage: [
    'languages.id as languages_id',
    'languages.language_name',
    'languages_level.id as languages_level_id',
    'languages_level.level_name'
  ],

  queryStudentEducation: [
    'student_education.id',
    'student_education.school_name',
    'student_education.program',
    'student_education.gpa',
    'student_education.start_year',
    'student_education.end_year',
    'education_level.level_name'
  ],

  queryStudentSkill: [
    'students_skill.skill_name',
    'skill_level.level_name'
  ],

  queryStudentSocial: [
    'students_social.Twitter',
    'students_social.Facebook',
    'students_social.Instagram',
    'students_social.Linkedin',
    'students_social.Github',
    'students_social.Pinterest',
    'students_social.Vimeo',
    'students_social.Tumblr',
    'students_social.Flickr',
    'students_social.Link'
  ],

  queryListStudent: [
    'student_id',
    'firstname',
    'lastname'
  ],

  queryListLecturer: [
    'lecturer_id',
    'firstname',
    'lastname',
    'position_name'
  ],

  queryProjectOutsider: [
    'id',
    'firstname',
    'lastname',
    'email'
  ]
}
