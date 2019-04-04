
exports.up = async function (knex) {
  await knex.schema.createTable('project_type', function (table) {
    table.increments('id').primary()
    table.string('project_type_name').notNullable()

    table
      .timestamp('created_at')
      .notNullable()
      .defaultTo(knex.raw('CURRENT_TIMESTAMP'))
    table
      .timestamp('updated_at')
      .notNullable()
      .defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))
  })
}

exports.down = async function (knex) {
  await knex.schema.dropTable('project_type')
}
