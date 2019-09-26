exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('skill_level')
    .del()
    .then(() => {
      const data = [
        {
          id: 1,
          level_name: 'Beginner'
        },
        {
          id: 2,
          level_name: 'Intermediate'
        },
        {
          id: 3,
          level_name: 'Expert'
        }
      ]
      return knex('skill_level').insert(data)
    })
}
