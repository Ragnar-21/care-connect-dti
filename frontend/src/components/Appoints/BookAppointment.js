import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
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
} from '@mui/material'

const BookAppointment = () => {
  const { userData, isLoading: authLoading } = useAuth()
  const [formData, setFormData] = useState({
    doctorMedicalId: '',
    patientMedicalId: userData?.medicalId || '',
    preferredDate: '',
    preferredTime: '',
    symptoms: '',
    contactInfo: '',
    notificationType: 'email',
    meetingType: 'offline', // Default to offline meeting
  })
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [userProfileLoading, setUserProfileLoading] = useState(false)

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
    if (!userData?.medicalId) {
      alert(
        'Please update your profile with a medical ID before booking an appointment.'
      )
      return
    }

    const data = {
      ...formData,
      patientMedicalId: userData.medicalId,
    }

    try {
      setUserProfileLoading(true)
      await createAppointmentRequest(data)
      setUserProfileLoading(false)
      alert(
        'Appointment request submitted successfully! Please check your pending requests for updates.'
      )

      // Reset form
      setFormData({
        doctorMedicalId: '',
        patientMedicalId: userData.medicalId,
        preferredDate: '',
        preferredTime: '',
        symptoms: '',
        contactInfo: '',
        notificationType: 'email',
      })
    } catch (error) {
      setUserProfileLoading(false)
      alert(
        'Failed to submit appointment request: ${error.response?.data?.message || error.message}'
      )
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
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
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Book Appointment
        </Typography>
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Select Doctor</InputLabel>
            <Select
              name="doctorMedicalId"
              value={formData.doctorMedicalId}
              onChange={handleChange}
              required
            >
              {doctors.map((doctor) => (
                <MenuItem key={doctor.medicalId} value={doctor.medicalId}>
                  Dr. {doctor.username} -{' '}
                  {doctor.specialty || 'General Practitioner'}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            type="date"
            name="preferredDate"
            label="Preferred Date"
            value={formData.preferredDate}
            onChange={handleChange}
            required
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            type="time"
            name="preferredTime"
            label="Preferred Time"
            value={formData.preferredTime}
            onChange={handleChange}
            required
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            multiline
            rows={4}
            name="symptoms"
            label="Symptoms/Reason for Visit"
            value={formData.symptoms}
            onChange={handleChange}
            required
            sx={{ mb: 2 }}
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
        </form>
      </Paper>
    </Container>
  )
}

export default BookAppointment
