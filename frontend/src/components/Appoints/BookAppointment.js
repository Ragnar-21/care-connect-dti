import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useLocation } from 'react-router-dom'
import {
  createAppointmentRequest,
  getAllDoctors,
} from '../../services/api'
import {
  Container,
  TextField,
  Button,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
  Paper,
  Box,
  CircularProgress,
  Switch,
  FormControlLabel,
  Alert,
  Snackbar,
} from '@mui/material'

const BookAppointment = () => {
  const location = useLocation()
  const { userData, isLoading: authLoading } = useAuth()
  
  // Debug log for incoming data
  console.log('BookAppointment - Location State:', location.state);
  
  // Log the incoming state
  console.log('BookAppointment - Incoming state:', location.state);
  console.log('BookAppointment - severityScore from state:', location.state?.severityScore);
  console.log('BookAppointment - urgencyLevel from state:', location.state?.urgencyLevel);
  
  const [formData, setFormData] = useState({
    doctorMedicalId: '',
    patientMedicalId: userData?.medicalId || '',
    preferredDate: '',
    preferredTime: '',
    symptoms: location.state?.symptoms || '',
    contactInfo: '',
    notificationType: 'email',
    meetingType: 'offline',
    urgencyLevel: location.state?.urgencyLevel || 'Routine',
    urgencyScore: location.state?.severityScore === undefined ? 0 : location.state.severityScore
  })
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [userProfileLoading, setUserProfileLoading] = useState(false)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  })

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await getAllDoctors()
        setDoctors(response.data.doctors || [])
        setLoading(false)
      } catch (error) {
        console.error('Error fetching doctors:', error)
        setLoading(false)
      }
    }

    fetchDoctors()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const appointmentData = {
        ...formData,
        patientMedicalId: userData.medicalId,
        urgencyScore: formData.urgencyScore,
        urgencyLevel: formData.urgencyLevel
      }

      const response = await createAppointmentRequest(appointmentData)
      
      setSnackbar({
        open: true,
        message: 'Appointment request sent successfully!',
        severity: 'success'
      })
      
      // Reset form or redirect
      setFormData({
        ...formData,
        doctorMedicalId: '',
        preferredDate: '',
        preferredTime: '',
        symptoms: '',
        contactInfo: ''
      })
      
    } catch (error) {
      console.error('Error booking appointment:', error)
      setSnackbar({
        open: true,
        message: 'Failed to book appointment. Please try again.',
        severity: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }

    setSnackbar({ ...snackbar, open: false })
  }

  if (loading || authLoading) {
    return (
      <Container>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="200px"
        >
          <CircularProgress />
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" 
          sx={{ 
            color: '#185a9d',
            fontWeight: 700,
            mb: 4
          }}>
          Book an Appointment
        </Typography>

        {location.state?.fromSymptomChecker && (
          <Alert severity="info" sx={{ mb: 3 }}>
            Based on your symptom analysis:
            <Typography component="div" sx={{ mt: 1 }}>
              • Urgency Level: <strong>{formData.urgencyLevel || 'Not specified'}</strong>
              <br/>
              • Severity Score: <strong>{formData.urgencyScore !== undefined ? `${formData.urgencyScore}/10` : 'Not specified'}</strong>
            </Typography>
          </Alert>
        )}

        <Box component="form" noValidate sx={{ mt: 3 }} onSubmit={handleSubmit}>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Select Doctor</InputLabel>
            <Select
              value={formData.doctorMedicalId}
              onChange={(e) =>
                setFormData({ ...formData, doctorMedicalId: e.target.value })
              }
              label="Select Doctor"
            >
              {doctors.map((doctor) => (
                <MenuItem key={doctor.medicalId} value={doctor.medicalId}>
                  {doctor.username} - {doctor.specialization}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Symptoms & Concerns"
            value={formData.symptoms}
            onChange={(e) =>
              setFormData({ ...formData, symptoms: e.target.value })
            }
            sx={{ mb: 3 }}
          />

          {!location.state?.fromSymptomChecker && (
            <>
              <Alert severity="info" sx={{ mb: 2 }}>
                To set urgency level other than routine, please use the Symptom Checker first to assess your condition.
              </Alert>
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Urgency Level</InputLabel>
                <Select
                  value="Routine"
                  disabled
                  label="Urgency Level"
                >
                  <MenuItem value="Routine">Routine</MenuItem>
                </Select>
                <FormHelperText>
                  Use Symptom Checker to determine appointment urgency
                </FormHelperText>
              </FormControl>
            </>
          )}

          {location.state?.fromSymptomChecker && (
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Urgency Level</InputLabel>
              <Select
                value={formData.urgencyLevel}
                disabled
                label="Urgency Level"
              >
                <MenuItem value={formData.urgencyLevel}>{formData.urgencyLevel}</MenuItem>
              </Select>
              <FormHelperText>
                Urgency level determined by Symptom Checker
              </FormHelperText>
            </FormControl>
          )}

          <TextField
            fullWidth
            type="date"
            label="Preferred Date"
            value={formData.preferredDate}
            onChange={(e) =>
              setFormData({ ...formData, preferredDate: e.target.value })
            }
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 3 }}
          />

          <TextField
            fullWidth
            type="time"
            label="Preferred Time"
            value={formData.preferredTime}
            onChange={(e) =>
              setFormData({ ...formData, preferredTime: e.target.value })
            }
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 3 }}
          />

          <TextField
            fullWidth
            name="contactInfo"
            label="Contact Information"
            value={formData.contactInfo}
            onChange={handleChange}
            required
            sx={{ mb: 2 }}
          />

          <Box sx={{ mb: 3 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.meetingType === 'online'}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      meetingType: e.target.checked ? 'online' : 'offline',
                    })
                  }
                  color="primary"
                />
              }
              label={
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    {formData.meetingType === 'online'
                      ? 'Online Video Call'
                      : 'In-Person Meeting'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formData.meetingType === 'online'
                      ? 'This appointment will be conducted via video call'
                      : 'This appointment will be conducted in-person at the clinic'}
                  </Typography>
                </Box>
              }
              sx={{ alignItems: 'flex-start' }}
            />
          </Box>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Notification Preference</InputLabel>
            <Select
              name="notificationType"
              value={formData.notificationType}
              onChange={handleChange}
            >
              <MenuItem value="email">Email</MenuItem>
            </Select>
            <FormHelperText>
              How would you like to receive appointment notifications?
            </FormHelperText>
          </FormControl>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={userProfileLoading}
          >
            {userProfileLoading ? 'Loading...' : 'Book Appointment'}
          </Button>
        </Box>
      </Paper>
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  )
}

export default BookAppointment
