
exports.up = async function (knex) {
  await knex.schema.createTable('lecturer_assignment', function (table) {
    table.increments('id').primary()
    table.integer('lecturer_course_id').unsigned().references('lecturer_course.id')
    table.integer('assignment_id').unsigned().references('assignments.id')
    table.boolean('isCreator').notNullable().defaultTo(false)
    table.boolean('isApprover').notNullable().defaultTo(false)
  })
}

exports.down = async function (knex) {
  await knex.schema.dropTable('lecturer_assignment')
}
