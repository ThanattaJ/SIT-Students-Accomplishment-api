exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('term')
    .del()
    .then(() => {
      const data = [
        {
          id: 1,
          term_number: 1
        },
        {
          id: 2,
          term_number: 2
        }
      ]
      return knex('term').insert(data)
    })
}
