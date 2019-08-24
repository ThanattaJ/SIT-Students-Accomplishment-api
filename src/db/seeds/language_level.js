exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('languages_level')
    .del()
    .then(() => {
      const data = [
        {
          id: 1,
          level_name: 'Native'
        },
        {
          id: 2,
          level_name: 'Proficient'
        },
        {
          id: 3,
          level_name: 'Competent'
        },
        {
          id: 4,
          level_name: 'Elementary'
        }
      ]
      return knex('languages_level').insert(data)
    })
}
