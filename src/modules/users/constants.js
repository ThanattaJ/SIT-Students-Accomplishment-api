module.exports = {
  queryStudentInformation: [
    'students.id',
    'students.student_id',
    'students.password',
    'students.introduce_detail',
    'students.firstname_en',
    'students.lastname_en',
    'students.firstname_th',
    'students.lastname_th',
    'students.university_gpa',
    'students.email',
    'students.profile_picture',
    'students.viwer',
    'students.resume_gen_count',
    'curriculum.curriculum_name',
    'students_profile.nickname_en',
    'students_profile.nickname_th',
    'students_profile.birthday',
    'students_profile.telephone_number',
    'students_profile.gender',
    'students_profile.nationality_en',
    'students_profile.nationality_th',
    'student_address_th.students_profile_id',
    'student_address_th.description_th',
    'student_address_th.district_th',
    'student_address_th.subdistrict_th',
    'student_address_th.province_th',
    'student_address_th.postcode_th',
    'student_address_en.description_en',
    'student_address_en.district_en',
    'student_address_en.subdistrict_en',
    'student_address_en.province_en',
    'student_address_en.postcode_en'
  ],

  queryStudentLanuage: [
    'languages.language_name_en',
    'languages_level.level_name_en'
  ],

  queryStudentEducation: [
    'student_education.school_name_en',
    'student_education.school_name_th',
    'student_education.gpa',
    'student_education.start_year_en',
    'student_education.end_year_en',
    'student_education.start_year_th',
    'student_education.end_year_th',
    'education_level.level_name_en',
    'education_level.level_name_th'
  ],

  queryListStudent: [
    'student_id',
    'firstname_en',
    'lastname_en'
  ],

  queryProjectOutsider: [
    'id',
    'firstname',
    'lastname',
    'email'
  ]
}
