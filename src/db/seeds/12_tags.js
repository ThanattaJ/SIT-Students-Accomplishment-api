const faker = require('faker')

exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('tags')
    .del()
    .then(async () => {
      // eslint-disable-next-line no-return-await
      return await (async () => {
        for (let i = 1; i < 11; i++) {
          await knex('tags').insert({
            id: i,
            tag_name: faker.random.word()
          })
        }
      })()
    })
}
