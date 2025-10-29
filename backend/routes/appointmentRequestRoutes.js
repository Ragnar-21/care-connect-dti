const {
  createAppointmentRequest,
  getDoctorAppointmentRequests,
  getPatientAppointmentRequests,
  updateAppointmentRequestStatus,
  addMessageToRequest,
  getAppointmentRequestById
} = require('../controllers/appointmentRequestController')

const appointmentRequestRoutes = (app) => {
  // Create new appointment request
  app.post('/api/appointment-requests', createAppointmentRequest)
  
  // Get appointment requests for doctor
  app.get('/api/appointment-requests/doctor/:doctorMedicalId', getDoctorAppointmentRequests)
  
  // Get appointment requests for patient
  app.get('/api/appointment-requests/patient/:patientMedicalId', getPatientAppointmentRequests)
  
  // Update appointment request status
  app.put('/api/appointment-requests/:requestId/status', updateAppointmentRequestStatus)
  
  // Add message to appointment request
  app.post('/api/appointment-requests/:requestId/messages', addMessageToRequest)
  
  // Get specific appointment request
  app.get('/api/appointment-requests/:requestId', getAppointmentRequestById)
}

module.exports = appointmentRequestRoutes
