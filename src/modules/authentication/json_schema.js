const joi = require('joi')

module.exports = {
  authenSchema: joi.object().keys({
    username: joi.string().required().trim(),
    userType: joi.string().required().trim(),
    password: joi.string().required().trim()
  })
}
