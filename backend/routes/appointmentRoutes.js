const express = require('express')
const router = express.Router()
const {
  bookAppointment,
  getDoctorAvailability,
  getAppointmentHistory,
  getAllDoctors,
  getAllPatients,
  getPendingAppointments,
  getUpcomingAppointments,
} = require('../controllers/appointmentController')

// Book a new appointment
router.post('/book', bookAppointment)

// Get doctor's availability
router.get('/availability', getDoctorAvailability)

// Get appointment history
router.get('/history', getAppointmentHistory)

// Get all doctors
router.get('/doctors', getAllDoctors)

// Get all patients
router.get('/patients', getAllPatients)

// Get pending appointments
router.get('/appointments/pending/:userId', getPendingAppointments)

// Get upcoming appointments
router.get('/appointments/upcoming/:userId', getUpcomingAppointments)

module.exports = router
