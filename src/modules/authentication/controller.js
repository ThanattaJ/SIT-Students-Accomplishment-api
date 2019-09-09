require('dotenv').config()
const passport = require('passport')
const Ldapstrategy = require('passport-ldapauth')
const { validate } = require('../validation')
const { authenSchema } = require('./json_schema')

module.exports = {
  authenticate: (req, res, next) => {
    const { checkStatus, err } = validate(req.body, authenSchema)
    if (!checkStatus) return res.send(err)

    const { username, user_type, password } = req.body
    const OPTS = Ldapstrategy.Options = {
      server: {
        url: process.env.LDAP_URL,
        bindDn: 'uid=student01,ou=People,ou=st,dc=sit,dc=kmutt,dc=ac,dc=th',
        bindCredentials: password,
        searchBase: 'ou=People,ou=st,dc=sit,dc=kmutt,dc=ac,dc=th',
        searchFilter: 'uid={{username}}'
      }
    }

    passport.use(new Ldapstrategy(OPTS))
    passport.authenticate('ldapauth', (err, user, info) => {
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
        res.send({
          status: 200,
          data: user
        })
      }
    })(req, res, next)
  }
}
