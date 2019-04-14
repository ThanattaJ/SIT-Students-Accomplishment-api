const faker = require('faker')

exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('students')
    .del()
    .then(async () => {
      // eslint-disable-next-line no-return-await
      return await (async () => {
        for (let i = 1; i < 6; i++) {
          let student = {
            id: i,
            student_id: `591305000${i}`,
            password: `591305000${i}`,
            curriculum_id: Math.floor(Math.random() * Math.floor(3) + 1),
            firstname_en: faker.name.firstName(),
            lastname_en: faker.name.lastName(),
            email: faker.internet.email()
          }
          await knex('students').insert(student)
          const profileId = await knex('students_profile').insert({
            id: i,
            student_id: student.student_id,
            nickname_en: student.firstname_en,
            birthday: faker.date.past(),
            telephone_number: faker.phone.phoneNumber(),
            nationality_en: 'Thai',
            nationality_th: 'ไทย'
          })
          await knex('student_address_en').insert({
            id: i,
            students_profile_id: profileId[0]
          })
          await knex('student_address_th').insert({
            id: i,
            students_profile_id: profileId[0]
          })
        }
      })()
    })
}
