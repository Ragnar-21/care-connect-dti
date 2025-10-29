const process = require('process')
const User = require('../models/userModel')
const jwt = require('jsonwebtoken')

exports.signup = async (req, res) => {
  const { username, email, password, medicalId, role, phoneNumber } = req.body
  try {
    const user = new User({
      username,
      email,
      password,
      medicalId,
      role,
      phoneNumber,
    })
    await user.save()
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' },    ) // Extended to 24 hours for better user experience
    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        medicalId: user.medicalId,
      },
    })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

exports.login = async (req, res) => {
  const { username, password } = req.body
  try {
    const user = await User.findOne({ username })
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' },
    ) // Extended to 24 hours for better user experience   
     res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        medicalId: user.medicalId,
      },
    })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

exports.refreshToken = async (req, res) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.substring(7)
    : authHeader

  if (!token) {
    return res.status(401).json({ message: 'No token provided' })
  }

  try {
    // Verify the current token (even if expired)
    const decoded = jwt.verify(token, process.env.JWT_SECRET, { ignoreExpiration: true })

    // Check if user still exists
    const user = await User.findById(decoded.id)
    if (!user) {
      return res.status(401).json({ message: 'User not found' })
    }

    // Generate new token
    const newToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,      { expiresIn: '24h' }
    )

    res.status(200).json({
      token: newToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        medicalId: user.medicalId,
      },
    })
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' })
  }
}
