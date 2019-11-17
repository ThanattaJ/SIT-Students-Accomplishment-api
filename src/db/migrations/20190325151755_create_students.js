
exports.up = async function (knex) {
  await knex.schema.createTable('students', function (table) {
    table.increments('id').primary()
    table.string('student_id').notNullable()
    table.integer('curriculum_id').unsigned()
    table.text('introduce_detail')
    table.string('firstname').notNullable()
    table.string('lastname').notNullable()
    table.string('email')
    table.string('profile_picture')
    table.string('resume_picture')
    table.integer('viewer').defaultTo(0)
    table.integer('resume_gen_count').defaultTo(0)

    table
      .timestamp('created_at')
      .notNullable()
      .defaultTo(knex.raw('CURRENT_TIMESTAMP'))
    table
      .timestamp('updated_at')
      .notNullable()
      .defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))

    table.unique('student_id')
    table.foreign('curriculum_id').references('curriculum.id')
  })
}

exports.down = async function (knex) {
  await knex.schema.dropTable('students')
}
