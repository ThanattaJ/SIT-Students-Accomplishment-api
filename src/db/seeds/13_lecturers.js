const faker = require('faker')

exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('lecturers')
    .del()
    .then(async () => {
      // eslint-disable-next-line no-return-await
      return await (async () => {
        const position = ['Associate Chairperson of B.Sc. Program in Information Technology', 'Chairperson of B.Sc. Program in Information Technology', 'Chairperson of Ph.D. Program in Information Technology and Computer Science']
        for (let i = 0; i < 2; i++) {
          let lecturer = {
            id: i + 1,
            lecturer_id: `1212312121${i + 1}`,
            position_name: position[i],
            firstname: faker.name.firstName(),
            lastname: faker.name.lastName(),
            email: faker.internet.email()
          }
          await knex('lecturers').insert(lecturer)
        }
      })()
    })
}
