require('dotenv').config()
const passport = require('passport')
const Ldapstrategy = require('passport-ldapauth')
const jwt = require('jwt-simple')
const { validate } = require('../validation')
const { authenSchema } = require('./json_schema')
const userModel = require('../users/model')

module.exports = {
  login: (req, res, next) => {
    const { checkStatus, err } = validate(req.body, authenSchema)
    if (!checkStatus) return res.send(err)
    const { username, userType, password } = req.body
    const detail = {
      role: userType === process.env.at_sign ? 'student' : 'lecturer',
      searchBase: userType === process.env.at_sign ? process.env.search_base_student : process.env.staff
    }
    const OPTS = Ldapstrategy.Options = {
      server: {
        url: process.env.LDAP_URL,
        bindDn: `uid=${username},ou=People,${detail.searchBase}`,
        bindCredentials: password,
        searchBase: `ou=People,${detail.searchBase}`,
        searchFilter: 'uid={{username}}'
      }
    }

    passport.use(new Ldapstrategy(OPTS))
    passport.authenticate('ldapauth', async (err, user, info) => {
      var error = err || info
      if (error) {
        res.send({
          status: 500,
          data: error
        })
      } else if (!user) {
        res.send({
          status: 404,
          data: 'User Not Found'
        })
      } else {
        const payload = {
          uid: user.uid,
          fullname: user.givenName,
          email: user.mail || '',
          description: user.description,
          role: detail.role,
          iat: new Date().getTime()
        }
        const exist = await userModel.checkUser(detail.role, payload.uid)
        if (!exist) {
          let data = {}
          const name = payload.fullname.split(' ')
          if (detail.role === 'student') {
            data = {
              student_id: payload.uid,
              firstname: name[0],
              lastname: name[1],
              email: payload.email
            }
          } else {
            data = {
              lecturer_id: payload.uid,
              firstname: name[0],
              lastname: name[1],
              email: payload.email || null
            }
          }
          await userModel.createUser(detail.role, data, payload.description)
        }
        const SECRET = process.env.AUTHEN_SECRET_KEY
        res.send(jwt.encode(payload, SECRET))
      }
    })(req, res, next)
  },

  authorization: async (token) => {
    const SECRET = process.env.AUTHEN_SECRET_KEY
    try {
      return jwt.decode(token, SECRET)
    } catch (err) {
      throw new Error(err)
    }
  }
}
