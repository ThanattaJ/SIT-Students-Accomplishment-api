
exports.up = async function (knex) {
  await knex.schema.createTable('project_member', function (table) {
    table.integer('project_id').unsigned()
    table.string('student_id')

    table
      .timestamp('created_at')
      .notNullable()
      .defaultTo(knex.raw('CURRENT_TIMESTAMP'))
    table
      .timestamp('updated_at')
      .notNullable()
      .defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))

    table.foreign('project_id').references('projects.id')
    table.foreign('student_id').references('students.student_id')
  })
}

exports.down = async function (knex) {
  await knex.schema.dropTable('project_member')
}
