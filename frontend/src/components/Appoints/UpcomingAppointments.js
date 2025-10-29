import React, { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import {
  getUpcomingAppointments,
  addMessageToRequest,
  cancelAppointment,
} from '../../services/api'
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  Grid,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tooltip,
  IconButton,
} from '@mui/material'
import {
  Chat as ChatIcon,
  Cancel as CancelIcon,
  AccessTime as AccessTimeIcon,
} from '@mui/icons-material'
import { format, differenceInDays, differenceInHours } from 'date-fns'

const UpcomingAppointments = () => {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [chatOpen, setChatOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [chatMessages, setChatMessages] = useState([])
  const { userData } = useAuth()

  const fetchAppointments = async () => {
    try {
      setLoading(true)
      const response = await getUpcomingAppointments(userData.medicalId)
      console.log('Upcoming appointments response:', response.data) // Debug log

      // Get only approved appointments
      const upcomingAppts = (response.data.requests || [])
        .filter((req) => req.status === 'approved')
        .sort((a, b) => new Date(a.preferredDate) - new Date(b.preferredDate))

      console.log('Filtered appointments:', upcomingAppts) // Debug log
      setAppointments(upcomingAppts)
      setError(null)
    } catch (err) {
      console.error('Error fetching upcoming appointments:', err)
      setError('Failed to load upcoming appointments')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (userData?.medicalId) {
      fetchAppointments()
    }
  }, [userData])

  const handleCancel = async (appointmentId) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await cancelAppointment(appointmentId)
        fetchAppointments()
      } catch (error) {
        console.error('Error cancelling appointment:', error)
      }
    }
  }

  const handleChat = (appointment) => {
    setSelectedAppointment(appointment)
    setChatMessages(appointment.messages || [])
    setChatOpen(true)
  }

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedAppointment) return

    try {
      await addMessageToRequest(selectedAppointment._id, {
        message: message.trim(),
        senderMedicalId: userData.medicalId,
        senderName: userData.username,
      })
      setMessage('')
      fetchAppointments()
      // Update chat messages
      const updatedAppointment = appointments.find(
        (a) => a._id === selectedAppointment._id
      )
      if (updatedAppointment) {
        setChatMessages(updatedAppointment.messages || [])
      }
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  const getTimeUntilAppointment = (date) => {
    const now = new Date()
    const appointmentDate = new Date(date)
    const days = differenceInDays(appointmentDate, now)
    const hours = differenceInHours(appointmentDate, now) % 24

    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} away`
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} away`
    } else {
      return 'Less than an hour away'
    }
  }

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Container>
        <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
          <Typography color="error" variant="h6">
            {error}
          </Typography>
        </Paper>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Upcoming Appointments
      </Typography>

      <Grid container spacing={3}>
        {appointments.length === 0 ? (
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6">
                No upcoming appointments found
              </Typography>
            </Paper>
          </Grid>
        ) : (
          appointments.map((appointment) => (
            <Grid item xs={12} key={appointment._id}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  '&:hover': {
                    boxShadow: 6,
                  },
                }}
              >
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="flex-start"
                >
                  <Box>
                    <Typography variant="h5" gutterBottom>
                      Dr. {appointment.doctorName}
                    </Typography>
                    <Chip
                      label="CONFIRMED"
                      color="success"
                      size="small"
                      sx={{ mb: 2 }}
                    />
                    <Tooltip title="Time until appointment">
                      <Chip
                        icon={<AccessTimeIcon />}
                        label={getTimeUntilAppointment(
                          appointment.preferredDate
                        )}
                        color="primary"
                        size="small"
                        sx={{ ml: 1, mb: 2 }}
                      />
                    </Tooltip>
                    <Typography variant="body1">
                      <strong>Date:</strong>{' '}
                      {format(
                        new Date(appointment.preferredDate),
                        'dd/MM/yyyy'
                      )}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Time:</strong> {appointment.preferredTime}
                    </Typography>
                    {appointment.symptoms && (
                      <Typography variant="body1">
                        <strong>Symptoms:</strong> {appointment.symptoms}
                      </Typography>
                    )}
                    <Typography variant="body1">
                      <strong>Contact:</strong> {appointment.contactInfo}
                    </Typography>
                    {appointment.doctorResponse && (
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body1" color="success.main">
                          <strong>Doctor&apos;s Note:</strong>{' '}
                          {typeof appointment.doctorResponse === 'string'
                            ? appointment.doctorResponse
                            : appointment.doctorResponse.message}
                        </Typography>
                        {typeof appointment.doctorResponse !== 'string' &&
                          appointment.doctorResponse.respondedAt && (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Responded at:{' '}
                              {format(
                                new Date(
                                  appointment.doctorResponse.respondedAt
                                ),
                                'dd/MM/yyyy HH:mm'
                              )}
                            </Typography>
                          )}
                      </Box>
                    )}
                  </Box>

                  <Box display="flex" gap={1} alignItems="center">
                    <Tooltip title="Chat with doctor">
                      <IconButton
                        color="primary"
                        onClick={() => handleChat(appointment)}
                      >
                        <ChatIcon />
                        <Typography variant="caption" sx={{ ml: 0.5 }}>
                          ({appointment.messages?.length || 0})
                        </Typography>
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Cancel appointment">
                      <IconButton
                        color="error"
                        onClick={() => handleCancel(appointment._id)}
                      >
                        <CancelIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          ))
        )}
      </Grid>

      {/* Chat Dialog */}
      <Dialog
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Chat with Dr. {selectedAppointment?.doctorName}
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ mb: 2, maxHeight: '300px', overflowY: 'auto' }}>
            {chatMessages.map((msg, index) => (
              <Paper
                key={index}
                sx={{
                  p: 1,
                  mb: 1,
                  bgcolor:
                    msg.sender === userData.medicalId
                      ? 'primary.light'
                      : 'background.default',
                  color:
                    msg.sender === userData.medicalId
                      ? 'primary.contrastText'
                      : 'text.primary',
                }}
              >
                <Typography variant="caption" display="block">
                  {msg.senderName} -{' '}
                  {format(new Date(msg.timestamp), 'MMM d, HH:mm')}
                </Typography>
                <Typography variant="body2">{msg.message}</Typography>
              </Paper>
            ))}
            {chatMessages.length === 0 && (
              <Typography variant="body2" color="text.secondary" align="center">
                No messages yet. Start the conversation!
              </Typography>
            )}
          </Box>
          <TextField
            fullWidth
            multiline
            rows={2}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setChatOpen(false)}>Close</Button>
          <Button
            onClick={handleSendMessage}
            variant="contained"
            disabled={!message.trim()}
          >
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default UpcomingAppointments
