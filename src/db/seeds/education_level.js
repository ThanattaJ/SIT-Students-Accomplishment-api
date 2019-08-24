exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('education_level')
    .del()
    .then(() => {
      const data = [
        {
          id: 1,
          level_name: 'Junior High School'
        },
        {
          id: 2,
          level_name: 'Senior High School'
        },
        {
          id: 3,
          level_name: 'Technical College'
        },
        {
          id: 4,
          level_name: 'Polytechnical College'
        },
        {
          id: 5,
          level_name: 'Vocational Certificate (Voc. Cert.)'
        },
        {
          id: 6,
          level_name: 'Certificate of Technical Vocation'
        },
        {
          id: 7,
          level_name: 'Diploma/High Vocational Certificate (Dip./High Voc. Cert.)'
        },
        {
          id: 8,
          level_name: 'etc.'
        }
      ]
      return knex('education_level').insert(data)
    })
}
