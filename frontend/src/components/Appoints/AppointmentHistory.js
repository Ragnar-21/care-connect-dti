import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { getAppointmentHistory } from '../../services/api'
import {
  Container,
  Typography,
  Paper,
  Box,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Button,
  Chip,
} from '@mui/material'
import { VideoCall, LocationOn, Feedback } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'

const AppointmentHistory = () => {
  const { userData, isLoading: authLoading } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    if (authLoading) return

    if (userData?.medicalId) {
      fetchHistory()
    } else {
      setLoading(false)
    }
  }, [userData, authLoading])

  const fetchHistory = async () => {
    try {
      const response = await getAppointmentHistory(userData.medicalId)
      setAppointments(response.data.appointments || [])
      setLoading(false)
    } catch (error) {
      console.error('Error fetching appointment history:', error)
      setAppointments([])
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  if (authLoading || loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
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

  if (!userData) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h6" color="error">
            Please log in to view appointment history.
          </Typography>
        </Paper>
      </Container>
    )
  }

  if (!userData.medicalId) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h6" color="warning.main">
            Please update your profile with a medical ID to view appointment
            history.
          </Typography>
        </Paper>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Appointment History
      </Typography>
      <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
        View your past appointments and medical records
      </Typography>

      {appointments.length === 0 ? (
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h6" color="textSecondary">
            No appointment history found
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {appointments.map((appointment) => (
            <Grid item xs={12} md={6} key={appointment._id}>
              <Card elevation={3}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {userData.role === 'doctor'
                      ? `Patient: ${appointment.patientName || 'Unknown Patient'}`
                      : `Dr. ${appointment.doctorName || 'Unknown Doctor'}`}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Medical ID:</strong>{' '}
                      {userData.role === 'doctor'
                        ? appointment.patientMedicalId || 'N/A'
                        : appointment.doctorMedicalId || 'N/A'}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Date:</strong>{' '}
                      {formatDate(
                        appointment.scheduledDate || appointment.preferredDate
                      )}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Time:</strong>{' '}
                      {appointment.scheduledTime || appointment.preferredTime}
                    </Typography>
                    <Box sx={{ my: 1 }}>
                      <Chip
                        label={appointment.status || 'Unknown'}
                        color={
                          appointment.status === 'approved'
                            ? 'success'
                            : appointment.status === 'rejected'
                              ? 'error'
                              : appointment.status === 'pending'
                                ? 'warning'
                                : 'default'
                        }
                        size="small"
                      />
                      {appointment.meetingType && (
                        <Chip
                          icon={
                            appointment.meetingType === 'online' ? (
                              <VideoCall />
                            ) : (
                              <LocationOn />
                            )
                          }
                          label={
                            appointment.meetingType === 'online'
                              ? 'Video Call'
                              : 'In-Person'
                          }
                          color={
                            appointment.meetingType === 'online'
                              ? 'primary'
                              : 'secondary'
                          }
                          size="small"
                          sx={{ ml: 1 }}
                        />
                      )}
                    </Box>
                    {appointment.status === 'approved' &&
                      appointment.meetingType === 'online' &&
                      appointment.videoCallLink && (
                        <Box sx={{ mt: 2 }}>
                          <Button
                            variant="contained"
                            color="primary"
                            startIcon={<VideoCall />}
                            href={appointment.videoCallLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            size="small"
                          >
                            Join Video Call
                          </Button>
                          <Typography
                            variant="caption"
                            display="block"
                            sx={{ mt: 1, color: 'text.secondary' }}
                          >
                            Available 10 minutes before appointment time
                          </Typography>
                        </Box>
                      )}
                    {appointment.doctorResponse?.message && (
                      <Box
                        sx={{
                          mt: 2,
                          p: 2,
                          bgcolor: 'grey.100',
                          borderRadius: 1,
                        }}
                      >
                        <Typography variant="body2" color="textSecondary">
                          <strong>Doctor&apos;s Note:</strong>{' '}
                          {appointment.doctorResponse.message}
                        </Typography>
                      </Box>
                    )}
                    {/* Give Feedback Button for Patients with Approved Appointments */}
                    {userData?.role === 'patient' &&
                      appointment.status === 'approved' && (
                        <Box sx={{ mt: 2 }}>
                          <Button
                            variant="outlined"
                            color="primary"
                            startIcon={<Feedback />}
                            size="small"
                            onClick={() =>
                              navigate('/patient/feedback', {
                                state: {
                                  preselectedDoctor:
                                    appointment.doctorMedicalId,
                                  appointmentId: appointment._id,
                                },
                              })
                            }
                          >
                            Give Feedback
                          </Button>
                        </Box>
                      )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  )
}

export default AppointmentHistory
