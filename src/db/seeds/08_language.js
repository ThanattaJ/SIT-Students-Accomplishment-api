exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('languages')
    .del()
    .then(() => {
      const data = [
        {
          id: 1,
          language_name: 'Thai'
        },
        {
          id: 2,
          language_name: 'English'
        },
        {
          id: 3,
          language_name: 'Japanese'
        }
      ]
      return knex('languages').insert(data)
    })
}
