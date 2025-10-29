const mongoose = require('mongoose')

const appointmentSchema = new mongoose.Schema({
  doctorMedicalId: {
    type: String,
    required: true,
  },
  patientMedicalId: {
    type: String,
    required: true,
  },
  doctorName: { type: String, required: true },
  patientName: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  symptoms: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'confirmed'
  }
})

module.exports = mongoose.model('Appointment', appointmentSchema)
