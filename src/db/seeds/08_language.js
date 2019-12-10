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
        },
        {
          id: 4,
          language_name: 'Korean'
        },
        {
          id: 5,
          language_name: 'Latin'
        },
        {
          id: 6,
          language_name: 'Italian'
        },
        {
          id: 7,
          language_name: 'German'
        },
        {
          id: 8,
          language_name: 'Swedish'
        },
        {
          id: 9,
          language_name: 'Spanish'
        },
        {
          id: 9,
          language_name: 'Malay'
        },
        {
          id: 10,
          language_name: 'French'
        },
        {
          id: 11,
          language_name: 'Chinese'
        },
        {
          id: 12,
          language_name: 'Russian'
        },
        {
          id: 13,
          language_name: 'Indonesian'
        },
        {
          id: 13,
          language_name: 'Turkish'
        },
        {
          id: 14,
          language_name: 'Vietnamese'
        },
        {
          id: 15,
          language_name: 'Romanian'
        }
      ]
      return knex('languages').insert(data)
    })
}
