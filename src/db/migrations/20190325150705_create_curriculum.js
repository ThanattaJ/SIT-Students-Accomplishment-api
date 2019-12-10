
exports.up = async function (knex) {
  await knex.schema.createTable('curriculum', function (table) {
    table.increments('id').primary()
    table.string('curriculum_name').notNullable()
  })
}

exports.down = async function (knex) {
  await knex.schema.dropTable('curriculum')
}
