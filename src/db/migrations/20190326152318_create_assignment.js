
exports.up = async function (knex) {
  await knex.schema.createTable('assignments', function (table) {
    table.increments('id').primary()
    table.string('assignment_name').notNullable()
    table.string('assignment_detail')
    table.boolean('isGroup').defaultTo(0).notNullable()
    table.date('close_date').notNullable()
    table.string('join_code').notNullable()

    table
      .timestamp('created_at')
      .notNullable()
      .defaultTo(knex.raw('CURRENT_TIMESTAMP'))
    table
      .timestamp('updated_at')
      .notNullable()
      .defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))
    table.unique('join_code')
  })
}

exports.down = async function (knex) {
  await knex.schema.dropTable('assignments')
}
