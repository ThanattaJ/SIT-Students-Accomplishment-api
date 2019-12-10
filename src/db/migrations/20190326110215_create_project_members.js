
exports.up = async function (knex) {
  await knex.schema.createTable('project_member', function (table) {
    table.increments('id').primary()
    table.integer('project_id').unsigned()
    table.string('student_id')

    table.foreign('project_id').references('projects.id')
    table.foreign('student_id').references('students.student_id')
  })
}

exports.down = async function (knex) {
  await knex.schema.dropTable('project_member')
}
