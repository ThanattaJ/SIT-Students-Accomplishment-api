exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('languages_level')
    .del()
    .then(() => {
      const data = [
        {
          id: 1,
          level_name: 'Elementary'
        },
        {
          id: 2,
          level_name: 'Competent'
        },
        {
          id: 3,
          level_name: 'Proficient'
        },
        {
          id: 4,
          level_name: 'Native'
        }
      ]
      return knex('languages_level').insert(data)
    })
}
