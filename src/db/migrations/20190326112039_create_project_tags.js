
exports.up = async function (knex) {
  await knex.schema.createTable('project_tags', function (table) {
    table.integer('project_id').unsigned()
    table.integer('tag_id').unsigned()

    table.foreign('project_id').references('projects.id')
    table.foreign('tag_id').references('tags.id')

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
  await knex.schema.dropTable('project_tags')
}
