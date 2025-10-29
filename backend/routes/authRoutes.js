const { signup, login, refreshToken } = require('../controllers/authController')

const authRoutes = (app) => {
  app.post('/api/signup', signup)
  app.post('/api/login', login)
  app.post('/api/refresh-token', refreshToken)
}

module.exports = authRoutes
