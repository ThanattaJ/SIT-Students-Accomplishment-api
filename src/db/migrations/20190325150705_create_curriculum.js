
exports.up = async function (knex) {
  await knex.schema.createTable('curriculum', function (table) {
    table.increments('id').primary()
    table.string('curriculum_name').notNullable()

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
  await knex.schema.dropTable('curriculum')
}
