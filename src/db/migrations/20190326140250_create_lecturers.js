
exports.up = async function (knex) {
  await knex.schema.createTable('lecturers', function (table) {
    table.increments('id').primary()
    table.string('lecturer_id').notNullable()
    table.string('password').notNullable()
    table.integer('position_id').unsigned()
    table.string('firstname_en').notNullable()
    table.string('lastname_en').notNullable()
    table.string('firstname_th')
    table.string('lastname_th')
    table.string('email')
    table.boolean('isAdmin')

    table
      .timestamp('created_at')
      .notNullable()
      .defaultTo(knex.raw('CURRENT_TIMESTAMP'))
    table
      .timestamp('updated_at')
      .notNullable()
      .defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))

    table.unique('lecturer_id')
    table.foreign('position_id').references('lecturer_position.id')
  })
}

exports.down = async function (knex) {
  await knex.schema.dropTable('lecturers')
}
