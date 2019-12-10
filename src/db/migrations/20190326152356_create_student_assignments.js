
exports.up = async function (knex) {
  await knex.schema.createTable('student_assignment', function (table) {
    table.increments('id').primary()
    table.integer('assignment_id').unsigned().references('assignments.id')
    table.string('student_id').references('students.student_id')

    table.unique(['assignment_id', 'student_id'])
  })
}

exports.down = async function (knex) {
  await knex.schema.dropTable('student_assignment')
}
