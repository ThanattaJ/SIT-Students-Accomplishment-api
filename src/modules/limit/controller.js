require('dotenv').config()
const RateLimit = require('express-rate-limit')

module.exports = {
  clapLimiter: new RateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute window
    max: 25, // start blocking after 5 requests
    message: 'Too many accounts created from this IP, please try again after an hour'
  })
}
