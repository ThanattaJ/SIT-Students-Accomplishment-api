
exports.up = async function (knex) {
  await knex.schema.createTable('students_social', function (table) {
    table.integer('students_profile_id').unsigned().notNullable()
    table.string('Twitter')
    table.string('Facebook')
    table.string('Instagram')
    table.string('Linkedin')
    table.string('Github')
    table.string('Pinterest')
    table.string('Vimeo')
    table.string('Tumblr')
    table.string('Flickr')
    table.string('Link')

    table
      .timestamp('created_at')
      .notNullable()
      .defaultTo(knex.raw('CURRENT_TIMESTAMP'))
    table
      .timestamp('updated_at')
      .notNullable()
      .defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))

    table.foreign('students_profile_id').references('students_profile.id')
  })
}

exports.down = async function (knex) {
  await knex.schema.dropTable('students_social')
}
