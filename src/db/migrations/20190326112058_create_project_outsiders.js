
exports.up = async function (knex) {
  await knex.schema.createTable('project_outsiders', function (table) {
    table.increments('id').primary()
    table.integer('project_id').unsigned().references('projects.id')
    table.string('firstname').notNullable()
    table.string('lastname')
    table.string('email')

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
  await knex.schema.dropTable('project_outsiders')
}
