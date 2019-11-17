exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('project_type')
    .del()
    .then(() => {
      const type = [
        {
          id: 1,
          project_type_name: 'External'
        },
        {
          id: 2,
          project_type_name: 'Assignment'
        }
      ]
      return knex('project_type').insert(type)
    })
}
