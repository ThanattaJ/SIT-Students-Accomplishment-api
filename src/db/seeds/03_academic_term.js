exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('academic_term')
    .del()
    .then(() => {
      const data = [
        {
          id: 1,
          academic_year_id: 1,
          term_id: 1
        },
        {
          id: 2,
          academic_year_id: 1,
          term_id: 2
        }
      ]
      return knex('academic_term').insert(data)
    })
}
