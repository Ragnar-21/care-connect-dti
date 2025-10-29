import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { createFeedback, getAllDoctors } from '../../services/api'
import { useLocation } from 'react-router-dom'
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Rating,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Alert,
  CircularProgress,
} from '@mui/material'
import { Star, Send } from '@mui/icons-material'

const FeedbackForm = () => {
  const { userData } = useAuth()
  const location = useLocation()
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  // Get preselected data from navigation state
  const preselectedDoctor = location.state?.preselectedDoctor
  const appointmentId = location.state?.appointmentId

  const [formData, setFormData] = useState({
    doctorMedicalId: preselectedDoctor || '',
    rating: 0,
    comment: '',
    isAnonymous: false,
    appointmentId: appointmentId || null,
  })

  useEffect(() => {
    fetchDoctors()
  }, [])

  useEffect(() => {
    // Update form data if preselected doctor changes
    if (preselectedDoctor) {
      setFormData((prev) => ({
        ...prev,
        doctorMedicalId: preselectedDoctor,
        appointmentId: appointmentId || null,
      }))
    }
  }, [preselectedDoctor, appointmentId])

  const fetchDoctors = async () => {
    try {
      setLoading(true)
      const response = await getAllDoctors()
      setDoctors(response.data.doctors || [])
    } catch (error) {
      console.error('Error fetching doctors:', error)
      setError('Failed to load doctors')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleRatingChange = (event, newValue) => {
    setFormData((prev) => ({
      ...prev,
      rating: newValue,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (
      !formData.doctorMedicalId ||
      !formData.rating ||
      !formData.comment.trim()
    ) {
      setError('Please fill in all required fields')
      return
    }

    if (formData.rating < 1 || formData.rating > 5) {
      setError('Please provide a rating between 1 and 5 stars')
      return
    }

    try {
      setSubmitting(true)
      setError('')

      await createFeedback({
        doctorMedicalId: formData.doctorMedicalId,
        patientMedicalId: userData.medicalId,
        rating: formData.rating,
        comment: formData.comment.trim(),
        isAnonymous: formData.isAnonymous,
        appointmentId: formData.appointmentId,
      })

      setSuccess(true)
      setFormData({
        doctorMedicalId: preselectedDoctor || '',
        rating: 0,
        comment: '',
        isAnonymous: false,
        appointmentId: appointmentId || null,
      })

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(false)
      }, 3000)
    } catch (error) {
      console.error('Error submitting feedback:', error)
      setError(error.response?.data?.message || 'Failed to submit feedback')
    } finally {
      setSubmitting(false)
    }
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
      <Container maxWidth="md">
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
          Share Your Feedback
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
          {preselectedDoctor
            ? 'Share your experience with this appointment'
            : 'Help other patients by sharing your experience with our doctors'}
        </Typography>

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Thank you for your feedback! It has been submitted successfully.
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Select Doctor *</InputLabel>
            <Select
              name="doctorMedicalId"
              value={formData.doctorMedicalId}
              onChange={handleChange}
              required
              disabled={!!preselectedDoctor} // Disable if doctor is preselected
            >
              {doctors.map((doctor) => (
                <MenuItem key={doctor.medicalId} value={doctor.medicalId}>
                  Dr. {doctor.username} -{' '}
                  {doctor.specialty || 'General Practitioner'}
                </MenuItem>
              ))}
            </Select>
            {preselectedDoctor && (
              <Typography
                variant="caption"
                color="textSecondary"
                sx={{ mt: 1 }}
              >
                Doctor preselected from appointment
              </Typography>
            )}
          </FormControl>

          <Box sx={{ mb: 3 }}>
            <Typography component="legend" sx={{ mb: 1 }}>
              Rating *
            </Typography>
            <Box display="flex" alignItems="center" gap={2}>
              <Rating
                name="rating"
                value={formData.rating}
                onChange={handleRatingChange}
                size="large"
                icon={<Star fontSize="inherit" />}
                emptyIcon={<Star fontSize="inherit" />}
              />
              {formData.rating > 0 && (
                <Typography variant="body2" color="textSecondary">
                  {getRatingLabel(formData.rating)}
                </Typography>
              )}
            </Box>
          </Box>

          <TextField
            fullWidth
            multiline
            rows={4}
            name="comment"
            label="Your Feedback *"
            value={formData.comment}
            onChange={handleChange}
            placeholder="Please share your experience with this doctor..."
            required
            sx={{ mb: 3 }}
            inputProps={{ maxLength: 1000 }}
            helperText={`${formData.comment.length}/1000 characters`}
          />

          <FormControlLabel
            control={
              <Checkbox
                name="isAnonymous"
                checked={formData.isAnonymous}
                onChange={handleChange}
              />
            }
            label="Submit feedback anonymously"
            sx={{ mb: 3 }}
          />

          <Box display="flex" gap={2}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              startIcon={submitting ? <CircularProgress size={20} /> : <Send />}
              disabled={
                submitting ||
                !formData.doctorMedicalId ||
                !formData.rating ||
                !formData.comment.trim()
              }
              size="large"
            >
              {submitting ? 'Submitting...' : 'Submit Feedback'}
            </Button>
            <Button
              type="button"
              variant="outlined"
              onClick={() => {
                setFormData({
                  doctorMedicalId: preselectedDoctor || '',
                  rating: 0,
                  comment: '',
                  isAnonymous: false,
                  appointmentId: appointmentId || null,
                })
                setError('')
              }}
              disabled={submitting}
            >
              Clear Form
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  )
}

export default FeedbackForm
