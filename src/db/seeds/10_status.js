exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('status_project')
    .del()
    .then(() => {
      const data = [
        {
          id: 1,
          status_name: 'Wating'
        },
        {
          id: 2,
          status_name: 'Approve'
        },
        {
          id: 3,
          status_name: 'Reject'
        },
        {
          id: 4,
          status_name: 'Request'
        }
      ]
      return knex('status_project').insert(data)
    })
}
