
exports.up = async function (knex) {
  await knex.schema.createTable('academic_year', function (table) {
    table.increments('id').primary()
    table.integer('academic_year_th').notNullable()
    table.integer('academic_year_en').notNullable()

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
  await knex.schema.dropTable('academic_year')
}
