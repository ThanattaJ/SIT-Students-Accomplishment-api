exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('courses')
    .del()
    .then(() => {
      const data = [
        {
          id: 1,
          course_code: 'INT101',
          course_name: 'IT Fundamental'
        },
        {
          id: 2,
          course_code: 'INT102',
          course_name: 'Computer Programming I'
        },
        {
          id: 3,
          course_code: 'INT104',
          course_name: 'Discrete Mathematics for Information Technology'
        },
        {
          id: 4,
          course_code: 'INT201',
          course_name: 'Netwark I'
        },
        {
          id: 5,
          course_code: 'CSC102',
          course_name: 'Programming I'
        },
        {
          id: 6,
          course_code: 'CSC103',
          course_name: 'Computer Architecture and Organizations'
        },
        {
          id: 7,
          course_code: 'CSC209',
          course_name: 'Data Structures'
        },
        {
          id: 8,
          course_code: 'DSI105',
          course_name: 'Digital Fundamental'
        },
        {
          id: 9,
          course_code: 'SSC131',
          course_name: 'Human Relations'
        },
        {
          id: 10,
          course_code: 'SSC132',
          course_name: 'Cyberpsychology'
        },
        {
          id: 11,
          course_code: 'DSI103',
          course_name: 'Introduce to DSI'
        }
      ]
      return knex('courses').insert(data)
    })
}
