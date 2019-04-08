const outsiderModel = require('./model')
module.exports = {

  createOutsider: async (data) => {
    const result = await outsiderModel.addProjectOutsider(data)
    return result
  },

  updateOutsider: async (data) => {

  },

  deleteOutsider: async (req, res) => {
    const id = req.params.id
    try {
      await outsiderModel.deleteOutsider(id)
      res.status(200).send({
        status: 200,
        message: 'Delete Success'
      })
    } catch (err) {
      res.status(500).send({
        status: 500,
        message: err
      })
    }
  }

}
