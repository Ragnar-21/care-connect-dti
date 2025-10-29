const Feedback = require('../models/feedbackModel')
const User = require('../models/userModel')
const AppointmentRequest = require('../models/appointmentRequestModel')

// Create new feedback
exports.createFeedback = async (req, res) => {
  try {
    const { 
      doctorMedicalId, 
      patientMedicalId, 
      rating, 
      comment, 
      appointmentId,
      isAnonymous 
    } = req.body

    // Validate required fields
    if (!doctorMedicalId || !patientMedicalId || !rating || !comment) {
      return res.status(400).json({ 
        message: 'Doctor ID, Patient ID, rating, and comment are required' 
      })
    }

    // Get doctor and patient details
    const doctor = await User.findOne({ medicalId: doctorMedicalId, role: 'doctor' })
    const patient = await User.findOne({ medicalId: patientMedicalId, role: 'patient' })

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' })
    }

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' })
    }

    // Check if feedback already exists for this appointment (if appointmentId provided)
    if (appointmentId) {
      const existingFeedback = await Feedback.findOne({
        doctorMedicalId,
        patientMedicalId,
        appointmentId
      })

      if (existingFeedback) {
        return res.status(400).json({ 
          message: 'Feedback already exists for this appointment' 
        })
      }
    }

    const feedback = new Feedback({
      doctorMedicalId,
      patientMedicalId,
      doctorName: doctor.username,
      patientName: patient.username,
      appointmentId: appointmentId || null,
      rating: parseInt(rating),
      comment: comment.trim(),
      isAnonymous: isAnonymous || false
    })

    await feedback.save()

    res.status(201).json({
      message: 'Feedback submitted successfully',
      feedback: {
        _id: feedback._id,
        doctorMedicalId: feedback.doctorMedicalId,
        doctorName: feedback.doctorName,
        patientName: feedback.isAnonymous ? 'Anonymous Patient' : feedback.patientName,
        rating: feedback.rating,
        comment: feedback.comment,
        isAnonymous: feedback.isAnonymous,
        createdAt: feedback.createdAt
      }
    })
  } catch (error) {
    console.error('Error creating feedback:', error)
    res.status(500).json({ 
      message: 'Error submitting feedback', 
      error: error.message 
    })
  }
}

// Get all feedback for a specific doctor
exports.getDoctorFeedback = async (req, res) => {
  try {
    const { doctorMedicalId } = req.params

    // Verify doctor exists
    const doctor = await User.findOne({ medicalId: doctorMedicalId, role: 'doctor' })
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' })
    }

    const feedbacks = await Feedback.find({ doctorMedicalId })
      .sort({ createdAt: -1 })
      .select('-patientMedicalId') // Don't send patient medical ID for privacy

    // Calculate average rating and stats
    const totalFeedbacks = feedbacks.length
    const averageRating = totalFeedbacks > 0 
      ? feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0) / totalFeedbacks 
      : 0

    const ratingDistribution = {
      5: feedbacks.filter(f => f.rating === 5).length,
      4: feedbacks.filter(f => f.rating === 4).length,
      3: feedbacks.filter(f => f.rating === 3).length,
      2: feedbacks.filter(f => f.rating === 2).length,
      1: feedbacks.filter(f => f.rating === 1).length,
    }

    // Format feedbacks for response (hide patient names if anonymous)
    const formattedFeedbacks = feedbacks.map(feedback => ({
      _id: feedback._id,
      patientName: feedback.isAnonymous ? 'Anonymous Patient' : feedback.patientName,
      rating: feedback.rating,
      comment: feedback.comment,
      isAnonymous: feedback.isAnonymous,
      createdAt: feedback.createdAt,
      appointmentId: feedback.appointmentId
    }))

    res.status(200).json({
      doctor: {
        medicalId: doctor.medicalId,
        name: doctor.username,
        specialty: doctor.specialty || 'General Practitioner'
      },
      feedbacks: formattedFeedbacks,
      stats: {
        totalFeedbacks,
        averageRating: Math.round(averageRating * 10) / 10,
        ratingDistribution
      }
    })
  } catch (error) {
    console.error('Error fetching doctor feedback:', error)
    res.status(500).json({ 
      message: 'Error fetching feedback', 
      error: error.message 
    })
  }
}

// Get feedback submitted by a specific patient
exports.getPatientFeedback = async (req, res) => {
  try {
    const { patientMedicalId } = req.params

    // Verify patient exists
    const patient = await User.findOne({ medicalId: patientMedicalId, role: 'patient' })
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' })
    }

    const feedbacks = await Feedback.find({ patientMedicalId })
      .sort({ createdAt: -1 })

    res.status(200).json({
      patient: {
        medicalId: patient.medicalId,
        name: patient.username
      },
      feedbacks
    })
  } catch (error) {
    console.error('Error fetching patient feedback:', error)
    res.status(500).json({ 
      message: 'Error fetching feedback', 
      error: error.message 
    })
  }
}

// Delete feedback (only by the patient who created it)
exports.deleteFeedback = async (req, res) => {
  try {
    const { feedbackId } = req.params
    const { patientMedicalId } = req.body

    const feedback = await Feedback.findById(feedbackId)
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' })
    }

    // Check if the patient is the owner of this feedback
    if (feedback.patientMedicalId !== patientMedicalId) {
      return res.status(403).json({ 
        message: 'You can only delete your own feedback' 
      })
    }

    await Feedback.findByIdAndDelete(feedbackId)

    res.status(200).json({ message: 'Feedback deleted successfully' })
  } catch (error) {
    console.error('Error deleting feedback:', error)
    res.status(500).json({ 
      message: 'Error deleting feedback', 
      error: error.message 
    })
  }
}
