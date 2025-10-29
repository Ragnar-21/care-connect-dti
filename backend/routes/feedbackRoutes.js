const {
  createFeedback,
  getDoctorFeedback,
  getPatientFeedback,
  deleteFeedback,
} = require('../controllers/feedbackController')

const feedbackRoutes = (app) => {
  // Create new feedback
  app.post('/api/feedback', createFeedback)
  
  // Get all feedback for a specific doctor
  app.get('/api/feedback/doctor/:doctorMedicalId', getDoctorFeedback)
  
  // Get all feedback submitted by a specific patient
  app.get('/api/feedback/patient/:patientMedicalId', getPatientFeedback)
  
  // Delete feedback
  app.delete('/api/feedback/:feedbackId', deleteFeedback)
}

module.exports = feedbackRoutes
