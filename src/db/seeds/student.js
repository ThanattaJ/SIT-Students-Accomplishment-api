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
            student_id: `5913050000${i}`,
            password: `5913050000${i}`,
            curriculum_id: Math.floor(Math.random() * Math.floor(3) + 1),
            firstname: faker.name.firstName(),
            lastname: faker.name.lastName(),
            email: faker.internet.email()
          }
          await knex('students').insert(student)
          const profileId = await knex('students_profile').insert({
            id: i,
            student_id: student.student_id,
            nickname: student.firstname,
            birthday: faker.date.past(),
            telephone_number: faker.phone.phoneNumber()
          })
          await knex('student_address').insert({
            id: i,
            students_profile_id: profileId[0]
          })
        }
      })()
    })
}
