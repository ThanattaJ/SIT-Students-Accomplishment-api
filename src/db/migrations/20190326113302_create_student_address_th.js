
exports.up = async function (knex) {
  await knex.schema.createTable('student_address_th', function (table) {
    table.increments('id').primary()
    table.integer('students_profile_id').unsigned().notNullable()
    table.string('description_th')
    table.string('district_th')
    table.string('subdistrict_th')
    table.string('province_th')
    table.string('postcode_th')

    table
      .timestamp('created_at')
      .notNullable()
      .defaultTo(knex.raw('CURRENT_TIMESTAMP'))
    table
      .timestamp('updated_at')
      .notNullable()
      .defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))

    table.foreign('students_profile_id').references('students_profile.id')
  })
}

exports.down = async function (knex) {
  await knex.schema.dropTable('student_address_th')
}
