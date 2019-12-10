
exports.up = async function (knex) {
  await knex.schema.createTable('project_achievement', function (table) {
    table.increments('id').primary()
    table.integer('project_id').unsigned()
    table.string('achievement_name').notNullable()
    table.string('organize_by')
    table.date('date_of_event')
    table.text('achievement_detail')

    table.foreign('project_id').references('projects.id')
  })
}

exports.down = async function (knex) {
  await knex.schema.dropTable('project_achievement')
}
