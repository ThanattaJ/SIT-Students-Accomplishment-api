
exports.up = async function (knex) {
  await knex.schema.createTable('project_documents', function (table) {
    table.increments('id').primary()
    table.integer('project_id').unsigned().notNullable()
    table.string('path_name')

    table.foreign('project_id').references('projects.id')
  })
}

exports.down = async function (knex) {
  await knex.schema.dropTable('project_document')
}
