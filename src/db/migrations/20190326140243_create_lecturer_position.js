
exports.up = async function (knex) {
  await knex.schema.createTable('lecturer_position', function (table) {
    table.increments('id').primary()
    table.string('position_name')

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
  await knex.schema.dropTable('lecturer_position')
}
