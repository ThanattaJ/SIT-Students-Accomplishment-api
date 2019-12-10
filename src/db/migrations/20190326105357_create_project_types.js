
exports.up = async function (knex) {
  await knex.schema.createTable('project_type', function (table) {
    table.increments('id').primary()
    table.string('project_type_name').notNullable()
  })
}

exports.down = async function (knex) {
  await knex.schema.dropTable('project_type')
}
