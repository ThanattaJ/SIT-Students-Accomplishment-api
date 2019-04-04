require('dotenv').config()

module.exports = {
  development: {
    client: 'mysql',
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      charset: 'utf8'
    },
    migrations: {
      directory: './src/db/migrations'
    },
    seeds: {
      directory: './src/db/seeds'
    },
    pool: {
      min: 0,
      max: 7
    }
  }
}
