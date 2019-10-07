
exports.up = async function (knex) {
  await knex.schema.createTable('project_assignment', function (table) {
    table.increments('id').primary()
    table.integer('project_id').unsigned().references('projects.id')
    table.integer('status_id').unsigned().references('status_project.id')
    table.integer('assignment_id').unsigned().references('assignments.id')
    table.string('comment')

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
  await knex.schema.dropTable('project_assignment')
}
