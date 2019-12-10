
exports.up = async function (knex) {
  await knex.schema.createTable('education_level', function (table) {
    table.increments('id').primary()
    table.string('level_name').notNullable()
  })
}

exports.down = async function (knex) {
  await knex.schema.dropTable('education_level')
}
