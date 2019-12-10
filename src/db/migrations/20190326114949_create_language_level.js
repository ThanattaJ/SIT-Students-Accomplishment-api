
exports.up = async function (knex) {
  await knex.schema.createTable('languages_level', function (table) {
    table.increments('id').primary()
    table.string('level_name').notNullable()
  })
}

exports.down = async function (knex) {
  await knex.schema.dropTable('languages_level')
}
