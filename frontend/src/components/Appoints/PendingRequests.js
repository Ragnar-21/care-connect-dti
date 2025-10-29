import React, { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import {
  getPatientAppointmentRequests,
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
  CircularProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material'
import { format } from 'date-fns'

const PendingRequests = () => {
  const [pendingRequests, setPendingRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [chatOpen, setChatOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [chatMessages, setChatMessages] = useState([])
  const { userData } = useAuth()

  const fetchRequests = async () => {
    try {
      setLoading(true)
      const response = await getPatientAppointmentRequests(userData.medicalId)
      // Filter only pending requests
      const pending = (response.data.requests || []).filter(
        (req) => req.status === 'pending'
      )
      setPendingRequests(pending)
      setError(null)
    } catch (err) {
      console.error('Error fetching pending requests:', err)
      setError('Failed to load pending appointment requests')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (userData?.medicalId) {
      fetchRequests()
    }
  }, [userData])

  const handleCancel = async (requestId) => {
    try {
      await cancelAppointment(requestId)
      fetchRequests()
    } catch (error) {
      console.error('Error cancelling request:', error)
    }
  }

  const handleChat = async (request) => {
    setSelectedRequest(request)
    setChatMessages(request.messages || [])
    setChatOpen(true)
  }

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedRequest) return

    try {
      await addMessageToRequest(selectedRequest._id, {
        message: message.trim(),
        senderMedicalId: userData.medicalId,
        senderName: userData.username,
      })
      setMessage('')
      fetchRequests()
      // Update chat messages
      const updatedRequest = pendingRequests.find(
        (r) => r._id === selectedRequest._id
      )
      if (updatedRequest) {
        setChatMessages(updatedRequest.messages || [])
      }
    } catch (error) {
      console.error('Error sending message:', error)
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
        Pending Appointment Requests
      </Typography>

      <Grid container spacing={3}>
        {pendingRequests.length === 0 ? (
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6">
                No pending appointment requests
              </Typography>
            </Paper>
          </Grid>
        ) : (
          pendingRequests.map((request) => (
            <Grid item xs={12} key={request._id}>
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
                      Dr. {request.doctorName}
                    </Typography>
                    <Chip
                      label="PENDING"
                      color="warning"
                      size="small"
                      sx={{ mb: 2 }}
                    />
                    <Typography variant="body1">
                      <strong>Date:</strong>{' '}
                      {format(new Date(request.preferredDate), 'dd/MM/yyyy')}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Time:</strong> {request.preferredTime}
                    </Typography>
                    {request.symptoms && (
                      <Typography variant="body1">
                        <strong>Symptoms:</strong> {request.symptoms}
                      </Typography>
                    )}
                    <Typography variant="body1">
                      <strong>Contact:</strong> {request.contactInfo}
                    </Typography>
                  </Box>

                  <Box display="flex" gap={1}>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleChat(request)}
                    >
                      CHAT ({request.messages?.length || 0})
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleCancel(request._id)}
                    >
                      CANCEL
                    </Button>
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
        <DialogTitle>Chat with Dr. {selectedRequest?.doctorName}</DialogTitle>
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

export default PendingRequests
