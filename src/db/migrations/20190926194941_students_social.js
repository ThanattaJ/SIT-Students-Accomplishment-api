
exports.up = async function (knex) {
  await knex.schema.createTable('students_social', function (table) {
    table.increments('id').primary()
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

    table.foreign('students_profile_id').references('students_profile.id')
  })
}

exports.down = async function (knex) {
  await knex.schema.dropTable('students_social')
}
