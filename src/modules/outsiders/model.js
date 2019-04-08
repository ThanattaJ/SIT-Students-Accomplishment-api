const knex = require('../../db/knex')
module.exports = {

  addProjectOutsider: async (outsider) => {
    await knex('project_outsiders').insert(outsider)
    const outsiders = await knex.select('*').from('project_outsiders').where('project_id', outsider[0].project_id)
    return outsiders
  },

  updateProjectOutsider: async (id, data) => {

  },

  deleteOutsider: async (id) => {
    try {
      await knex('project_outsiders').del().where('id', id)
    } catch (err) {
      throw Error(err)
    }
  }

}
