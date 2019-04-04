
exports.up = async function (knex) {
  await knex.schema.createTable('status_project', function (table) {
    table.increments('id').primary()
    table.string('status_name')

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
  await knex.schema.dropTable('status_project')
}
