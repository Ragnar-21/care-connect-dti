const nodemailer = require('nodemailer')
const process = require('process')
require('dotenv').config()

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

const sendEmail = (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error)
    } else {
      console.log('Email sent:', info.response)
    }
  })
}

const sendNotification = (type, to, subject, text) => {
  if (type === 'email') {
    sendEmail(to, subject, text)
  } else {
    console.warn(`Unsupported notification type: ${type}. Only email notifications are supported.`)
  }
}

module.exports = { sendNotification }
