
exports.up = async function (knex) {
  await knex.schema.createTable('student_assignment', function (table) {
    table.increments('id').primary()
    table.integer('assignment_id').unsigned().references('assignments.id')
    table.string('student_id').references('students.student_id')
    table.unique(['assignment_id', 'student_id'])
    table
      .timestamp('created_at')
      .notNullable()
      .defaultTo(knex.raw('CURRENT_TIMESTAMP'))
    table
      .timestamp('updated_at')
      .notNullable()
      .defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))
  })
}

exports.down = async function (knex) {
  await knex.schema.dropTable('student_assignment')
}
