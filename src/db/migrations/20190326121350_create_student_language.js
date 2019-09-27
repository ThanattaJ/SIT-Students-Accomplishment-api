
exports.up = async function (knex) {
  await knex.schema.createTable('student_language', function (table) {
    table.integer('students_profile_id').unsigned().references('students_profile.id')
    table.integer('language_id').unsigned().references('languages.id')
    table.integer('level_id').unsigned().references('languages_level.id')

    table
      .timestamp('created_at')
      .notNullable()
      .defaultTo(knex.raw('CURRENT_TIMESTAMP'))
    table
      .timestamp('updated_at')
      .notNullable()
      .defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))
    table.index(['students_profile_id', 'language_id'], 'student_language_index')
  })
}

exports.down = async function (knex) {
  await knex.schema.dropTable('student_language')
}
