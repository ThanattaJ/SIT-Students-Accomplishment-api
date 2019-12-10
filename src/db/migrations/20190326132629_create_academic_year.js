
exports.up = async function (knex) {
  await knex.schema.createTable('academic_year', function (table) {
    table.increments('id').primary()
    table.integer('academic_year_th').notNullable()
    table.integer('academic_year_en').notNullable()
  })
}

exports.down = async function (knex) {
  await knex.schema.dropTable('academic_year')
}
