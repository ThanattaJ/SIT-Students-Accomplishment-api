const userModel = require('./model')
module.exports = {

  createOutsider: async (data) => {
    const result = await userModel.addProjectOutsider(data)
    return result
  },

  updateOutsider: async (data) => {

  }
}
