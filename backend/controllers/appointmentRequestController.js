const AppointmentRequest = require('../models/appointmentRequestModel')
const User = require('../models/userModel')
const { 
  sendAppointmentApprovalEmail, 
  sendDoctorConfirmationEmail, 
  sendAppointmentRejectionEmail 
} = require('../services/emailService')

// Generate Jitsi video call link
const generateJitsiLink = (patientName, doctorName, appointmentDate, appointmentTime) => {
  // Create a unique room name using patient name, doctor name, and appointment details
  const roomName = `CareConnect-${patientName.replace(/\s+/g, '')}-${doctorName.replace(/\s+/g, '')}-${new Date(appointmentDate).toISOString().split('T')[0]}-${appointmentTime.replace(':', '')}`
  // Remove special characters and make it URL safe
  const sanitizedRoomName = roomName.replace(/[^a-zA-Z0-9-]/g, '')
  return `https://meet.jit.si/${sanitizedRoomName}`
}

// Create a new appointment request
exports.createAppointmentRequest = async (req, res) => {
  try {
    const { 
      doctorMedicalId, 
      patientMedicalId, 
      preferredDate, 
      preferredTime, 
      symptoms, 
      contactInfo, 
      notificationType,
      meetingType 
    } = req.body

    // Get doctor and patient details
    const doctor = await User.findOne({ medicalId: doctorMedicalId, role: 'doctor' })
    const patient = await User.findOne({ medicalId: patientMedicalId, role: 'patient' })

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' })
    }

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' })
    }

    const appointmentRequest = new AppointmentRequest({
      doctorMedicalId,
      patientMedicalId,
      doctorName: doctor.username,
      patientName: patient.username,
      doctorEmail: doctor.email,
      patientEmail: patient.email,
      preferredDate: new Date(preferredDate),
      preferredTime,
      symptoms,
      contactInfo,
      notificationType,
      meetingType: meetingType || 'offline', // Default to offline if not provided
      status: 'pending'
    })

    await appointmentRequest.save()

    res.status(201).json({
      message: 'Appointment request created successfully',
      appointmentRequest
    })
  } catch (error) {
    res.status(500).json({
      message: 'Error creating appointment request',
      error: error.message
    })
  }
}

// Get all appointment requests for a doctor
exports.getDoctorAppointmentRequests = async (req, res) => {
  try {
    const { doctorMedicalId } = req.params

    const requests = await AppointmentRequest.find({ 
      doctorMedicalId,
      status: { $in: ['pending', 'approved'] }
    }).sort({ createdAt: -1 })

    res.status(200).json({ requests })
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching appointment requests',
      error: error.message
    })
  }
}

// Get all appointment requests for a patient
exports.getPatientAppointmentRequests = async (req, res) => {
  try {
    const { patientMedicalId } = req.params
    console.log("Fetching appointments for patient:", patientMedicalId);

    // Get current date at start of day
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const requests = await AppointmentRequest.find({ 
      patientMedicalId,
      status: { $in: ['pending', 'approved'] },
      preferredDate: { $gte: currentDate }
    }).sort({ preferredDate: 1 })

    console.log(`Found ${requests.length} appointments for patient`);
    res.status(200).json({ requests })
  } catch (error) {
    console.error('Error in getPatientAppointmentRequests:', error);
    res.status(500).json({
      message: 'Error fetching appointment requests',
      error: error.message
    })
  }
}

// Update appointment request status (approve/reject)
exports.updateAppointmentRequestStatus = async (req, res) => {
  try {
    const { requestId } = req.params
    const { status, doctorResponse, scheduledDate, scheduledTime } = req.body

    const request = await AppointmentRequest.findById(requestId)
    if (!request) {
      return res.status(404).json({ message: 'Appointment request not found' })
    }

    request.status = status
    if (doctorResponse) {
      request.doctorResponse = {
        message: doctorResponse,
        respondedAt: new Date()
      }
    }
    
    if (status === 'approved' && scheduledDate && scheduledTime) {
      request.scheduledDate = new Date(scheduledDate)
      request.scheduledTime = scheduledTime
      
      // Generate video call link for online meetings
      if (request.meetingType === 'online') {
        request.videoCallLink = generateJitsiLink(
          request.patientName,
          request.doctorName,
          scheduledDate,
          scheduledTime
        )
      }
    }

    await request.save()

    // Send email notifications
    try {
      if (status === 'approved') {
        // Extract patient email from contactInfo (assuming it's in email format)
        let patientEmail = request.contactInfo
        
        // If contactInfo is not an email, try to extract email from it
        if (!patientEmail.includes('@')) {
          // Try to find email in contactInfo string
          const emailMatch = request.contactInfo.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/)
          if (emailMatch) {
            patientEmail = emailMatch[0]
          } else {
            // Fallback to patient's registered email
            const patient = await User.findOne({ medicalId: request.patientMedicalId })
            patientEmail = patient?.email || null
          }
        }

        // Send approval email to patient
        if (patientEmail) {
          await sendAppointmentApprovalEmail(
            patientEmail,
            request.patientName,
            request.doctorName,
            request.scheduledDate,
            request.scheduledTime,
            doctorResponse,
            request.meetingType
          )
          console.log('Approval email sent to patient:', patientEmail)
        }

        // Send confirmation email to doctor
        const doctor = await User.findOne({ medicalId: request.doctorMedicalId })
        if (doctor?.email) {
          await sendDoctorConfirmationEmail(
            doctor.email,
            request.doctorName,
            request.patientName,
            request.scheduledDate,
            request.scheduledTime,
            request.meetingType
          )
          console.log('Confirmation email sent to doctor:', doctor.email)
        }

      } else if (status === 'rejected') {
        // Extract patient email from contactInfo
        let patientEmail = request.contactInfo
        
        if (!patientEmail.includes('@')) {
          const emailMatch = request.contactInfo.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/)
          if (emailMatch) {
            patientEmail = emailMatch[0]
          } else {
            const patient = await User.findOne({ medicalId: request.patientMedicalId })
            patientEmail = patient?.email || null
          }
        }

        // Send rejection email to patient
        if (patientEmail) {
          await sendAppointmentRejectionEmail(
            patientEmail,
            request.patientName,
            request.doctorName,
            doctorResponse
          )
          console.log('Rejection email sent to patient:', patientEmail)
        }
      }
    } catch (emailError) {
      console.error('Error sending email notifications:', emailError)
      // Don't fail the request if email fails, just log the error
    }

    res.status(200).json({
      message: `Appointment request ${status} successfully`,
      request
    })
  } catch (error) {
    res.status(500).json({
      message: 'Error updating appointment request',
      error: error.message
    })
  }
}

// Add a message to an appointment request
exports.addMessageToRequest = async (req, res) => {
  try {
    const { requestId } = req.params
    const { message, senderMedicalId, senderName } = req.body

    const request = await AppointmentRequest.findById(requestId)
    if (!request) {
      return res.status(404).json({ message: 'Appointment request not found' })
    }

    request.messages.push({
      sender: senderMedicalId,
      senderName,
      message,
      timestamp: new Date()
    })

    await request.save()

    res.status(200).json({
      message: 'Message added successfully',
      request
    })
  } catch (error) {
    res.status(500).json({
      message: 'Error adding message',
      error: error.message
    })
  }
}

// Get a specific appointment request by ID
exports.getAppointmentRequestById = async (req, res) => {
  try {
    const { requestId } = req.params

    const request = await AppointmentRequest.findById(requestId)
    if (!request) {
      return res.status(404).json({ message: 'Appointment request not found' })
    }

    res.status(200).json({ request })
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching appointment request',
      error: error.message
    })
  }
}
