module.exports = {
  queryStudentInformation: [
    'students.id',
    'students.student_id',
    'students.password',
    'students.introduce_detail',
    'students.firstname',
    'students.lastname',
    'students.university_gpa',
    'students.email',
    'students.profile_picture',
    'students.viwer',
    'students.resume_gen_count',
    'curriculum.curriculum_name',
    'students_profile.nickname',
    'students_profile.birthday',
    'students_profile.telephone_number',
    'students_profile.gender',
    'student_address.description',
    'student_address.district',
    'student_address.subdistrict',
    'student_address.province',
    'student_address.postcode'
  ],

  queryStudentLanguage: [
    'languages.language_name',
    'languages_level.level_name'
  ],

  queryStudentEducation: [
    'student_education.school_name',
    'student_education.gpa',
    'student_education.start_year',
    'student_education.end_year',
    'education_level.level_name'
  ],

  queryListStudent: [
    'student_id',
    'firstname',
    'lastname'
  ],

  queryProjectOutsider: [
    'id',
    'firstname',
    'lastname',
    'email'
  ]
}
