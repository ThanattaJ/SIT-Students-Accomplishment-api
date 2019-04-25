
exports.up = async function (knex) {
  await knex.schema.createTable('education_level', function (table) {
    table.increments('id').primary()
    table.string('level_name_en').notNullable()
    table.string('level_name_th').notNullable()

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
  await knex.schema.dropTable('education_level')
}