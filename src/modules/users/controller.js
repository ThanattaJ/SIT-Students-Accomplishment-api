const userModel = require('./model')
module.exports = {

  getuUserById: async (data) => {
    const result = await userModel.getuUserById(data.user_role, data.id)
    return result
  }
}
