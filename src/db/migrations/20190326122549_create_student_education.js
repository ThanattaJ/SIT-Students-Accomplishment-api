
exports.up = async function (knex) {
  await knex.schema.createTable('student_education', function (table) {
    table.integer('students_profile_id').unsigned().references('students_profile.id')
    table.integer('education_level_id').unsigned().references('education_level.id')
    table.string('school_name').notNullable()
    table.string('program')
    table.float('gpa', 3, 2)
    table.string('start_year')
    table.string('end_year')

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
  await knex.schema.dropTable('student_education')
}
