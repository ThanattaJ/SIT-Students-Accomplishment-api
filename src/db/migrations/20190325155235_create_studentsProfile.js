
exports.up = async function (knex) {
  await knex.schema.createTable('students_profile', function (table) {
    table.increments('id').primary()
    table.string('student_id').notNullable()
    table.string('nickname')
    table.date('birthday')
    table.string('telephone_number')

    table
      .timestamp('created_at')
      .notNullable()
      .defaultTo(knex.raw('CURRENT_TIMESTAMP'))
    table
      .timestamp('updated_at')
      .notNullable()
      .defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))

    table.foreign('student_id').references('students.student_id')
  })
}

exports.down = async function (knex) {
  await knex.schema.dropTable('students_profile')
}
