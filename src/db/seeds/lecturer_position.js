exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('lecturer_position')
    .del()
    .then(() => {
      const data = [
        {
          id: 1,
          position_name: 'Lecturer'
        },
        {
          id: 2,
          position_name: 'Chairperson of Ph.D. Program in Information Technology and Computer Science'
        },
        {
          id: 3,
          position_name: 'Chairperson of B.Sc. Program in Information Technology'
        },
        {
          id: 4,
          position_name: 'Associate Chairperson of B.Sc. Program in Information Technology'
        },
        {
          id: 5,
          position_name: 'Associate Chairperson of B.Sc. Program in Information Technology'
        },
        {
          id: 6,
          position_name: 'Associate Chairperson of B.Sc. Program in Information Technology'
        }
      ]
      return knex('lecturer_position').insert(data)
    })
}
