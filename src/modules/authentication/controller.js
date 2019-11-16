require('dotenv').config()
const passport = require('passport')
const Ldapstrategy = require('passport-ldapauth')
const jwt = require('jwt-simple')
const { validate } = require('../validation')
const { authenSchema } = require('./json_schema')
const userModel = require('../users/model')

const login = (req, res, next) => {
  const { checkStatus, err } = validate(req.body, authenSchema)
  if (!checkStatus) return res.send(err)
  const { username, userType, password } = req.body
  const detail = {
    role: userType === process.env.at_sign ? 'student' : 'lecturer',
    searchBase: userType === process.env.at_sign ? process.env.search_base_student : process.env.search_base_staff
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
      let payload = {}
      if (detail.role === 'student') {
        payload = {
          uid: user.uid,
          fullname: user.givenName || user.gecos,
          email: user.mail.search('@') ? user.mail : '',
          description: user.description.search('@') ? 'IT' : user.description,
          role: detail.role,
          iat: new Date().getTime()
        }
      } else {
        payload = {
          uid: user.uid,
          fullname: user.givenName || user.gecos,
          email: user.mail || '',
          description: user.description,
          role: detail.role,
          iat: new Date().getTime()
        }
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
            email: payload.email || null,
            position_name: payload.description
          }
        }
        await userModel.createUser(detail.role, data, payload.description)
      }
      const SECRET = process.env.AUTHEN_SECRET_KEY
      if (payload.role === 'lecturer') {
        const isAdmin = await userModel.getLecturerIsAdmin(payload.uid)
        res.status(200).send({
          status: 200,
          fullname: payload.fullname,
          token: jwt.encode(payload, SECRET),
          isAdmin: isAdmin
        })
      }
      res.status(200).send({
        status: 200,
        token: jwt.encode(payload, SECRET)
      })
    }
  })(req, res, next)
}

const authorization = (token) => {
  try {
    const SECRET = process.env.AUTHEN_SECRET_KEY
    console.log(jwt.decode(token, SECRET))
    return jwt.decode(token, SECRET)
  } catch (err) {
    throw new Error(err)
  }
}

const verifyToken = (req, res, next) => {
  if (req.headers['authorization'] === undefined) {
    return res.status(401).send({ auth: false, message: 'No token provided.' })
  }

  const token = req.headers['authorization'].split(' ')[0]
  if (token === '') return res.status(403).send({ auth: false, message: 'No token provided.' })
  req.auth = authorization(token)
  next()
}

module.exports = { login, authorization, verifyToken }
