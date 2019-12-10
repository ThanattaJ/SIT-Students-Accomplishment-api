
exports.up = async function (knex) {
  await knex.schema.createTable('languages', function (table) {
    table.increments('id').primary()
    table.string('language_name').notNullable()
  })
}

exports.down = async function (knex) {
  await knex.schema.dropTable('languages')
}
