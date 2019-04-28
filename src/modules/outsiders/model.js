const knex = require('../../db/knex')
const { queryProjectOutsider } = require('./constants')
module.exports = {

  addProjectOutsider: async (outsiders) => {
    try {
      await knex('project_outsiders').insert(outsiders)
    } catch (err) {
      throw new Error(err)
    }
  },

  getProjectOutsider: async (projectId) => {
    try {
      const outsiders = await knex.select(queryProjectOutsider).from('project_outsiders').where('project_id', projectId)
      return outsiders
    } catch (err) {
      throw new Error(err)
    }
  },

  updateProjectOutsider: async (outsider) => {
    try {
      await knex('project_outsiders').where('id', outsider.id)
    } catch (err) {
      throw new Error(err)
    }
  },

  deleteOutsider: async (id) => {
    try {
      await knex('project_outsiders').del().where('id', id)
    } catch (err) {
      throw new Error(err)
    }
  }

}
