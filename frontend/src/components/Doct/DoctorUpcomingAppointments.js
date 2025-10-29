import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import {
  getDoctorAppointmentRequests,
  addMessageToRequest,
} from '../../services/api'
import {
  Container,
  Paper,
  Typography,
  Chip,
  Box,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Card,
  CardContent,
  Grid,
} from '@mui/material'

const DoctorUpcomingAppointments = () => {
  const { userData, isLoading: authLoading } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [newMessage, setNewMessage] = useState('')
  const [chatDialogOpen, setChatDialogOpen] = useState(false)

  // Helper function to safely render values
  const safeRender = (value, fallback = 'N/A') => {
    if (value === null || value === undefined) return fallback
    if (typeof value === 'string' || typeof value === 'number') return value
    if (typeof value === 'object' && value.message) return value.message
    return fallback
  }

  useEffect(() => {
    // Don't make API calls while authentication is still loading
    if (authLoading) return

    console.log('DoctorUpcomingAppointments - userData:', userData) // Debug log
    if (userData?.medicalId) {
      console.log(
        'Fetching doctor upcoming appointments for medical ID:',
        userData.medicalId
      ) // Debug log
      fetchAppointments()
    } else {
      console.log('No medical ID found in userData') // Debug log
      setLoading(false)
    }
  }, [userData, authLoading])

  const fetchAppointments = async () => {
    try {
      console.log(
        'Making API call to fetch doctor appointments for:',
        userData.medicalId
      ) // Debug log
      const response = await getDoctorAppointmentRequests(userData.medicalId)
      console.log('Doctor API response:', response.data) // Debug log

      // Filter only approved appointments
      const approvedAppointments = (response.data.requests || []).filter(
        (req) => req.status === 'approved'
      )
      setAppointments(approvedAppointments)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching appointments:', error)
      setAppointments([])
      setLoading(false)
    }
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedAppointment) return

    try {
      await addMessageToRequest(selectedAppointment._id, {
        message: newMessage,
        senderMedicalId: userData.medicalId,
        senderName: userData.username,
      })
      setNewMessage('')
      fetchAppointments()
      // Update the selected appointment
      const updatedResponse = await getDoctorAppointmentRequests(
        userData.medicalId
      )
      const approvedAppointments = (updatedResponse.data.requests || []).filter(
        (req) => req.status === 'approved'
      )
      const updatedAppointment = approvedAppointments.find(
        (r) => r._id === selectedAppointment._id
      )
      setSelectedAppointment(updatedAppointment)
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Failed to send message')
    }
  }

  const openChat = (appointment) => {
    setSelectedAppointment(appointment)
    setChatDialogOpen(true)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  const isUpcoming = (dateString, timeString) => {
    const appointmentDateTime = new Date(`${dateString} ${timeString}`)
    return appointmentDateTime > new Date()
  }

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography>Loading upcoming appointments...</Typography>
      </Container>
    )
  }

  if (!userData) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h6" color="error">
            Please log in to view upcoming appointments.
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
            Please update your profile with a medical ID to view upcoming
            appointments.
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Current user data: {JSON.stringify(userData, null, 2)}
          </Typography>
        </Paper>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Upcoming Appointments
      </Typography>

      {appointments.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="textSecondary">
            No upcoming appointments found
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {appointments.map((appointment) => (
            <Grid item xs={12} md={6} key={appointment._id}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="start"
                  mb={2}
                >
                  <Typography variant="h6">
                    {safeRender(appointment.patientName, 'Unknown Patient')}
                  </Typography>
                  <Chip label="APPROVED" color="success" size="small" />
                </Box>

                <Typography variant="body2" color="textSecondary">
                  <strong>Patient Medical ID:</strong>{' '}
                  {safeRender(appointment.patientMedicalId)}
                </Typography>

                {appointment.scheduledDate && appointment.scheduledTime && (
                  <Box
                    sx={{
                      mb: 2,
                      p: 1,
                      bgcolor: 'success.light',
                      borderRadius: 1,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ color: 'success.contrastText' }}
                    >
                      <strong>Scheduled:</strong>{' '}
                      {formatDate(appointment.scheduledDate)} at{' '}
                      {appointment.scheduledTime}
                    </Typography>
                    {!isUpcoming(
                      appointment.scheduledDate,
                      appointment.scheduledTime
                    ) && (
                      <Typography
                        variant="caption"
                        sx={{ color: 'warning.contrastText', display: 'block' }}
                      >
                        (Past appointment)
                      </Typography>
                    )}
                  </Box>
                )}

                <Typography variant="body2" sx={{ mb: 2 }}>
                  <strong>Symptoms:</strong>{' '}
                  {safeRender(appointment.symptoms, 'Not specified')}
                </Typography>

                <Typography variant="body2" sx={{ mb: 2 }}>
                  <strong>Contact:</strong>{' '}
                  {safeRender(appointment.contactInfo, 'Not provided')}
                </Typography>

                {appointment.doctorResponse && (
                  <Box
                    sx={{ mb: 2, p: 1, bgcolor: 'info.light', borderRadius: 1 }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ color: 'info.contrastText' }}
                    >
                      <strong>Your Response:</strong>{' '}
                      {safeRender(
                        appointment.doctorResponse,
                        'No response provided'
                      )}
                    </Typography>
                  </Box>
                )}

                <Box display="flex" gap={1} flexWrap="wrap">
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => openChat(appointment)}
                  >
                    Chat ({appointment.messages?.length || 0})
                  </Button>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Chat Dialog */}
      <Dialog
        open={chatDialogOpen}
        onClose={() => setChatDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Chat with {selectedAppointment?.patientName || 'Patient'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ maxHeight: 300, overflowY: 'auto', mb: 2 }}>
            {selectedAppointment?.messages?.map((message, index) => (
              <Card key={index} sx={{ mb: 1 }}>
                <CardContent sx={{ py: 1 }}>
                  <Typography variant="subtitle2" color="primary">
                    {message.senderName || 'Unknown User'}
                  </Typography>
                  <Typography variant="body2">
                    {message.message || 'No message content'}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {message.timestamp
                      ? new Date(message.timestamp).toLocaleString()
                      : 'Unknown time'}
                  </Typography>
                </CardContent>
              </Card>
            )) || (
              <Typography variant="body2" color="textSecondary">
                No messages yet
              </Typography>
            )}
          </Box>
          <Divider sx={{ my: 2 }} />
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setChatDialogOpen(false)}>Close</Button>
          <Button
            variant="contained"
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
          >
            Send Message
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default DoctorUpcomingAppointments
