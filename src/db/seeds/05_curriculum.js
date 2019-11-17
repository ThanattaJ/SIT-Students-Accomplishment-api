exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('curriculum')
    .del()
    .then(() => {
      const name = [
        {
          id: 1,
          curriculum_name: 'CS'
        },
        {
          id: 2,
          curriculum_name: 'IT'
        },
        {
          id: 3,
          curriculum_name: 'DSI'
        }
      ]
      return knex('curriculum').insert(name)
    })
}
