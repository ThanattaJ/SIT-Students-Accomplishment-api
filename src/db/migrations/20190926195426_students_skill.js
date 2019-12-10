
exports.up = async function (knex) {
  await knex.schema.createTable('students_skill', function (table) {
    table.increments('id').primary()
    table.integer('students_profile_id').unsigned().notNullable()
    table.integer('skill_level_id').unsigned().notNullable()
    table.string('skill_name').notNullable()

    table.foreign('students_profile_id').references('students_profile.id')
    table.foreign('skill_level_id').references('skill_level.id')
    table.unique(['students_profile_id', 'skill_name'])
  })
}

exports.down = async function (knex) {
  await knex.schema.dropTable('students_skill')
}
