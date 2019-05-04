
exports.up = async function (knex) {
  await knex.schema.createTable('lecturer_assignment', function (table) {
    table.increments('id').primary()
    table.integer('lecturer_sub_id').unsigned().references('lecturer_course.id')
    table.integer('assignment_id').unsigned().references('assignments.id')
    table.boolean('isCreater').notNullable().defaultTo(false)
    table.boolean('isApprover').notNullable().defaultTo(false)

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
  await knex.schema.dropTable('lecturer_assignment')
}
