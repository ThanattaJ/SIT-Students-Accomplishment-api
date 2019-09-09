const joi = require('joi')

module.exports = {
  authenSchema: joi.object().keys({
    username: joi.string().required().trim(),
    user_type: joi.string().required().trim(),
    password: joi.string().required().trim()
  })
}
