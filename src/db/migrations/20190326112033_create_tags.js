
exports.up = async function (knex) {
  await knex.schema.createTable('tags', function (table) {
    table.increments('id').primary()
    table.string('tag_name').notNullable()
  })
}

exports.down = async function (knex) {
  await knex.schema.dropTable('tags')
}
