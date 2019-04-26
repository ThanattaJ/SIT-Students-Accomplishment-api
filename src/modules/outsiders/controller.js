const outsiderModel = require('./model')
const { validate } = require('../validation')
const { deleteOutsiderSchema } = require('./json_schema')

module.exports = {

  createOutsider: async (data) => {
    try {
      const result = await outsiderModel.addProjectOutsider(data)
      return result
    } catch (err) {
      throw new Error(err)
    }
  },

  getOutsider: async (projectId) => {
    try {
      const outsiders = await outsiderModel.getProjectOutsider(projectId)
      return outsiders
    } catch (err) {
      throw new Error(err)
    }
  },

  updateOutsider: async (outsiders) => {
    try {
      outsiders.forEach(async outsider => {
        await outsiderModel.updateProjectOutsider(outsider)
      })
    } catch (err) {
      throw new Error(err)
    }
  },

  deleteOutsider: async (req, res) => {
    const id = req.params.id
    const { checkStatus, err } = validate(req.params, deleteOutsiderSchema)
    if (!checkStatus) return res.send(err)

    try {
      await outsiderModel.deleteOutsider(id)
      res.status(200).send({
        status: 200,
        message: 'Delete Success'
      })
    } catch (err) {
      res.status(500).send({
        status: 500,
        message: err.message
      })
    }
  }

}
