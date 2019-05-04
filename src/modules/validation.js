const joi = require('joi')

module.exports = {
  validate: (unValidateDate, schema) => {
    const status = joi.validate(unValidateDate, schema, { abortEarly: false }, err => {
      if (err) {
        return {
          checkStatus: false,
          err: {
            message: 'Validate Error',
            details: err.details
          }
        }
      } else return { checkStatus: true }
    })
    return status
  }
}
