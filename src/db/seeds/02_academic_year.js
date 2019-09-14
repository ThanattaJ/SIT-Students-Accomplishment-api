exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('academic_year')
    .del()
    .then(() => {
      const data = [
        {
          id: 1,
          academic_year_th: 2560,
          academic_year_en: 2017
        },
        {
          id: 2,
          academic_year_th: 2561,
          academic_year_en: 2018
        }
      ]
      return knex('academic_year').insert(data)
    })
}
