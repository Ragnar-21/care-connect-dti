import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { getPatientFeedback, deleteFeedback } from '../../services/api'
import {
  Container,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Rating,
  Grid,
  CircularProgress,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  IconButton,
} from '@mui/material'
import { Delete, Edit, Visibility } from '@mui/icons-material'

const PatientFeedbackHistory = () => {
  const { userData } = useAuth()
  const [feedbacks, setFeedbacks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    feedbackId: null,
  })
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (userData?.medicalId && userData?.role === 'patient') {
      fetchFeedbacks()
    } else if (userData?.role && userData?.role !== 'patient') {
      setLoading(false)
      setError('Access denied. Only patients can view their feedback history.')
    } else if (!userData) {
      setLoading(false)
      setError('Please log in to view your feedback history.')
    }
    // If userData is still loading, keep loading state
  }, [userData])

  const fetchFeedbacks = async () => {
    try {
      setLoading(true)
      const response = await getPatientFeedback(userData.medicalId)
      setFeedbacks(response.feedbacks || [])
    } catch (error) {
      console.error('Error fetching patient feedback:', error)
      setError(
        error.response?.data?.message || 'Failed to load feedback history'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClick = (feedbackId) => {
    setDeleteDialog({ open: true, feedbackId })
  }

  const handleDeleteConfirm = async () => {
    try {
      setDeleting(true)
      await deleteFeedback(deleteDialog.feedbackId, userData.medicalId)

      // Remove from local state
      setFeedbacks((prev) =>
        prev.filter((f) => f._id !== deleteDialog.feedbackId)
      )

      setDeleteDialog({ open: false, feedbackId: null })
    } catch (error) {
      console.error('Error deleting feedback:', error)
      setError(error.response?.data?.message || 'Failed to delete feedback')
    } finally {
      setDeleting(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getRatingLabel = (rating) => {
    const labels = {
      1: 'Poor',
      2: 'Fair',
      3: 'Good',
      4: 'Very Good',
      5: 'Excellent',
    }
    return labels[rating] || ''
  }

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="400px"
        >
          <CircularProgress size={60} />
        </Box>
      </Container>
    )
  }

  if (error && !deleteDialog.open) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          My Feedback History
        </Typography>
        <Typography variant="body1" color="textSecondary">
          View and manage the feedback you&apos;ve submitted to doctors
        </Typography>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {feedbacks.length === 0 ? (
        <Paper elevation={1} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="textSecondary">
            No feedback submitted yet
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Your feedback submissions will appear here once you start reviewing
            doctors.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {feedbacks.map((feedback) => (
            <Grid item xs={12} key={feedback._id}>
              <Card elevation={2} sx={{ '&:hover': { elevation: 4 } }}>
                <CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                    }}
                  >
                    <Box sx={{ flexGrow: 1 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          mb: 2,
                        }}
                      >
                        <Typography variant="h6">
                          Dr. {feedback.doctorName}
                        </Typography>
                        {feedback.isAnonymous && (
                          <Chip
                            label="Anonymous"
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        )}
                        <Typography variant="body2" color="textSecondary">
                          {formatDate(feedback.createdAt)}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          mb: 2,
                        }}
                      >
                        <Rating value={feedback.rating} readOnly size="small" />
                        <Typography variant="body2" color="textSecondary">
                          {getRatingLabel(feedback.rating)} ({feedback.rating}
                          /5)
                        </Typography>
                      </Box>

                      <Typography
                        variant="body1"
                        sx={{ lineHeight: 1.6, mb: 2 }}
                      >
                        {feedback.comment}
                      </Typography>

                      {feedback.appointmentId && (
                        <Chip
                          label="From Appointment"
                          size="small"
                          color="secondary"
                          variant="outlined"
                        />
                      )}
                    </Box>

                    <Box
                      sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}
                    >
                      <IconButton
                        onClick={() => handleDeleteClick(feedback._id)}
                        color="error"
                        size="small"
                        title="Delete feedback"
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Statistics */}
      {feedbacks.length > 0 && (
        <Paper elevation={1} sx={{ p: 3, mt: 4, bgcolor: 'grey.50' }}>
          <Typography variant="h6" gutterBottom>
            Your Feedback Statistics
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="primary">
                  {feedbacks.length}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Total Reviews
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="success.main">
                  {(
                    feedbacks.reduce((sum, f) => sum + f.rating, 0) /
                    feedbacks.length
                  ).toFixed(1)}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Average Rating
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="info.main">
                  {feedbacks.filter((f) => f.isAnonymous).length}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Anonymous Reviews
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="warning.main">
                  {feedbacks.filter((f) => f.appointmentId).length}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  From Appointments
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() =>
          !deleting && setDeleteDialog({ open: false, feedbackId: null })
        }
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Delete Feedback</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this feedback? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialog({ open: false, feedbackId: null })}
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            disabled={deleting}
            startIcon={deleting ? <CircularProgress size={16} /> : <Delete />}
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default PatientFeedbackHistory
