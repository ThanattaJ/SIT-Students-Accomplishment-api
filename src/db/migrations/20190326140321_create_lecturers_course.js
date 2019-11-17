
exports.up = async function (knex) {
  await knex.schema.createTable('lecturer_course', function (table) {
    table.increments('id').primary()
    table.integer('academic_term_id').unsigned().references('academic_term.id')
    table.integer('courses_id').unsigned().references('courses.id')
    table.string('lecturer_id').references('lecturers.lecturer_id')
    table.unique(['academic_term_id', 'courses_id', 'lecturer_id'])
    table
      .timestamp('created_at')
      .notNullable()
      .defaultTo(knex.raw('CURRENT_TIMESTAMP'))
    table
      .timestamp('updated_at')
      .notNullable()
      .defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))

    table.unique(['courses_id', 'academic_term_id', 'lecturer_id'])
  })
}

exports.down = async function (knex) {
  await knex.schema.dropTable('lecturer_course')
}
