
exports.up = async function (knex) {
  await knex.schema.createTable('courses', function (table) {
    table.increments('id').primary()
    table.string('course_code').notNullable()
    table.string('course_name').notNullable()
    table.string('course_detail').notNullable()

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
  await knex.schema.dropTable('courses')
}
