
exports.up = async function (knex) {
  await knex.schema.createTable('student_language', function (table) {
    table.increments('id').primary()
    table.integer('students_profile_id').unsigned().references('students_profile.id')
    table.integer('language_id').unsigned().references('languages.id')
    table.integer('level_id').unsigned().references('languages_level.id')

    table.unique(['students_profile_id', 'language_id'], 'student_language_index_unique')
  })
}

exports.down = async function (knex) {
  await knex.schema.dropTable('student_language')
}
