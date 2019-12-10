
exports.up = async function (knex) {
  await knex.schema.createTable('project_outsiders', function (table) {
    table.increments('id').primary()
    table.integer('project_id').unsigned().references('projects.id')
    table.string('firstname').notNullable()
    table.string('lastname')
    table.string('email')
  })
}

exports.down = async function (knex) {
  await knex.schema.dropTable('project_outsiders')
}
