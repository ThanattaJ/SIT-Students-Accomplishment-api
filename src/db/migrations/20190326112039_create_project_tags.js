
exports.up = async function (knex) {
  await knex.schema.createTable('project_tags', function (table) {
    table.increments('id').primary()
    table.integer('project_id').unsigned()
    table.integer('tag_id').unsigned()

    table.foreign('project_id').references('projects.id')
    table.foreign('tag_id').references('tags.id')
    table.unique(['project_id', 'tag_id'])
  })
}

exports.down = async function (knex) {
  await knex.schema.dropTable('project_tags')
}
