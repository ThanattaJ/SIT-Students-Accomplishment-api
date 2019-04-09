const knex = require('../../db/knex')
module.exports = {

  addProjectOutsider: async (outsiders) => { await knex('project_outsiders').insert(outsiders) },

  getProjectOutsider: async (projectId) => {
    const outsiders = await knex.select('*').from('project_outsiders').where('project_id', projectId)
    return outsiders
  },

  updateProjectOutsider: async (outsider) => { await knex('project_outsiders').where('id', outsider.id) },

  deleteOutsider: async (id) => {
    try {
      await knex('project_outsiders').del().where('id', id)
    } catch (err) {
      throw Error(err)
    }
  }

}
