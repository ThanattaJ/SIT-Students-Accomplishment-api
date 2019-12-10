
exports.up = async function (knex) {
  await knex.schema.createTable('term', function (table) {
    table.increments('id').primary()
    table.integer('term_number').notNullable()
  })
}

exports.down = async function (knex) {
  await knex.schema.dropTable('term')
}
