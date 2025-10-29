const mongoose = require('mongoose')
const { broadcastAvailabilityUpdate } = require('../websocket')
const Doctor = require('../models/doctorModel')
const Appointment = require('../models/appointmentModel')
const AppointmentRequest = require('../models/appointmentRequestModel') // For appointment requests
const User = require('../models/userModel') // Add this line
const { sendNotification } = require('../services/notificationService')

exports.bookAppointment = async (req, res) => {
  const {
    doctorMedicalId,
    patientMedicalId,
    date,
    time,
    symptoms,
    contactInfo,
    notificationType,
  } = req.body

  try {
    // Find doctor by medical ID
    const doctor = await User.findOne({ 
      medicalId: doctorMedicalId, 
      role: 'doctor' 
    })

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found with this medical ID' })
    }

    // Find patient by medical ID
    const patient = await User.findOne({ 
      medicalId: patientMedicalId, 
      role: 'patient' 
    })

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found with this medical ID' })
    }

    // Check if doctor has availability (optional - can be enhanced later)
    // For now, we'll allow direct booking

    const appointment = new Appointment({
      doctorMedicalId,
      patientMedicalId,
      doctorName: doctor.username,
      patientName: patient.username,
      date,
      time,
      symptoms,
      status: 'confirmed'
    })

    await appointment.save()

    // Send confirmation notification to patient
    if (contactInfo && notificationType) {
      sendNotification(
        notificationType,
        contactInfo,
        'Appointment Confirmation',
        `Your appointment with Dr. ${doctor.username} on ${date} at ${time} has been confirmed.`,
      )
    }

    res
      .status(201)
      .json({ message: 'Appointment booked successfully', appointment })
  } catch (error) {
    console.error('Error booking appointment:', error)
    res.status(500).json({ message: 'Internal server error', error: error.message })
  }
}

exports.updateAvailability = async (req, res) => {
  const { doctorId, availability } = req.body

  try {
    const doctor = await Doctor.findById(doctorId)
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' })
    }

    doctor.availability = availability
    await doctor.save()

    broadcastAvailabilityUpdate({ doctorId, availability })

    res.status(200).json({ message: 'Availability updated successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error })
  }
}

exports.getDoctorAvailability = async (req, res) => {
  const { doctorId, date } = req.query

  try {
    const doctor = await Doctor.findById(doctorId)

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' })
    }

    const availability = doctor.availability.find(
      (a) => a.date.toISOString().split('T')[0] === date,
    )
    if (!availability) {
      return res.status(404).json({ message: 'No availability on this date' })
    }

    res.status(200).json({ availability })
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error })
  }
}

// Controller to get appointment history
exports.getAppointmentHistory = async (req, res) => {
  const { userMedicalId } = req.query

  try {
    const user = await User.findOne({ medicalId: userMedicalId })

    if (!user) {
      return res.status(404).json({ message: 'User not found with this medical ID' })
    }

    let appointments
    if (user.role === 'doctor') {
      appointments = await AppointmentRequest.find({ doctorMedicalId: userMedicalId })
        .sort({ createdAt: -1 }) // Sort by newest first
    } else {
      appointments = await AppointmentRequest.find({ patientMedicalId: userMedicalId })
        .sort({ createdAt: -1 }) // Sort by newest first
    }

    res.status(200).json({ appointments })
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Internal server error', error: error.message })
  }
}

// Get all doctors with their medical IDs
exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor' })
      .select('medicalId username email specialty location')

    res.status(200).json({ doctors })
  } catch (error) {
    console.error('Error fetching doctors:', error)
    res.status(500).json({ message: 'Internal server error', error: error.message })
  }
}

// Get all patients with their medical IDs  
exports.getAllPatients = async (req, res) => {
  try {
    const patients = await User.find({ role: 'patient' })
      .select('medicalId username email phoneNumber')

    res.status(200).json({ patients })
  } catch (error) {
    console.error('Error fetching patients:', error)
    res.status(500).json({ message: 'Internal server error', error: error.message })
  }
}

// Get pending appointments for a user
exports.getPendingAppointments = async (req, res) => {
  const { userId } = req.params

  try {
    const user = await User.findOne({ medicalId: userId })

    if (!user) {
      return res.status(404).json({ message: 'User not found with this medical ID' })
    }

    let appointments
    if (user.role === 'doctor') {
      appointments = await AppointmentRequest.find({ 
        doctorMedicalId: userId,
        status: 'pending'
      }).sort({ date: 1 })
    } else {
      appointments = await AppointmentRequest.find({ 
        patientMedicalId: userId,
        status: 'pending'
      }).sort({ date: 1 })
    }

    res.status(200).json({ appointments })
  } catch (error) {
    console.error('Error fetching pending appointments:', error)
    res.status(500).json({ message: 'Internal server error', error: error.message })
  }
}

// Get upcoming appointments for a user
exports.getUpcomingAppointments = async (req, res) => {
  const { userId } = req.params

  try {
    const user = await User.findOne({ medicalId: userId })

    if (!user) {
      return res.status(404).json({ message: 'User not found with this medical ID' })
    }

    const currentDate = new Date()
    let appointments

    if (user.role === 'doctor') {
      appointments = await Appointment.find({
        doctorMedicalId: userId,
        date: { $gte: currentDate },
        status: 'confirmed'
      }).sort({ date: 1, time: 1 })
    } else {
      appointments = await Appointment.find({
        patientMedicalId: userId,
        date: { $gte: currentDate },
        status: 'confirmed'
      }).sort({ date: 1, time: 1 })
    }

    res.status(200).json({ appointments })
  } catch (error) {
    console.error('Error fetching upcoming appointments:', error)
    res.status(500).json({ message: 'Internal server error', error: error.message })
  }
}
