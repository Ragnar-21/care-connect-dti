import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { getDoctorFeedback } from '../../services/api'
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
  Chip,
  LinearProgress,
  Avatar,
} from '@mui/material'
import { Star, Person, PersonOff } from '@mui/icons-material'

const DoctorFeedback = () => {
  const { userData, userRole } = useAuth()
  // console.log(useAuth());
  const [feedbackData, setFeedbackData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    console.log('DoctorFeedback - userData:', userData) // Debug log

    if (userData?.medicalId && userRole === 'doctor') {
      fetchFeedback()
      
    } else if (userRole && userRole !== 'doctor') {
      setLoading(false)
      setError(
        `Access denied. Current role: ${userData.role}. Only doctors can view their feedback.`
      )
      
    } else if (!userData) {
      setLoading(false)
      setError('Please log in to view feedback.')
    } 
    // If userData is still loading, keep loading state
  }, [userData])

  const fetchFeedback = async () => {
    try {
      setLoading(true)
      console.log("HELlo")
      const response = await getDoctorFeedback(userData.medicalId)
      // console.log(response)
      setFeedbackData(response)
    } catch (error) {
      console.error('Error fetching feedback:', error)
      setError(error.response?.data?.message || 'Failed to load feedback')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return 'success'
    if (rating >= 3.5) return 'primary'
    if (rating >= 2.5) return 'warning'
    return 'error'
  }

  const getRatingBarColor = (stars) => {
    const colors = {
      5: '#4caf50',
      4: '#8bc34a',
      3: '#ffc107',
      2: '#ff9800',
      1: '#f44336',
    }
    return colors[stars] || '#e0e0e0'
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

  if (error) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
      </Container>
    )
  }

  if (!feedbackData) {
    return (
      <Container maxWidth="lg">
        <Alert severity="info" sx={{ mt: 4 }}>
          No feedback data available.
        </Alert>
      </Container>
    )
  }

  const { doctor, feedbacks, stats } = feedbackData

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header Section */}
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Patient Feedback
        </Typography>
        <Typography variant="h6" color="textSecondary">
          Dr. {doctor.name} - {doctor.specialty}
        </Typography>

        {/* Overall Rating */}
        <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="h2"
              color={getRatingColor(stats.averageRating)}
            >
              {stats.averageRating}
            </Typography>
            <Rating
              value={stats.averageRating}
              precision={0.1}
              readOnly
              size="large"
              sx={{ mb: 1 }}
            />
            <Typography variant="body2" color="textSecondary">
              Based on {stats.totalFeedbacks} review
              {stats.totalFeedbacks !== 1 ? 's' : ''}
            </Typography>
          </Box>

          {/* Rating Distribution */}
          <Box sx={{ flexGrow: 1, ml: 4 }}>
            <Typography variant="h6" gutterBottom>
              Rating Distribution
            </Typography>
            {[5, 4, 3, 2, 1].map((stars) => (
              <Box
                key={stars}
                sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
              >
                <Typography variant="body2" sx={{ minWidth: 20 }}>
                  {stars}
                </Typography>
                <Star sx={{ fontSize: 16, mx: 1 }} />
                <LinearProgress
                  variant="determinate"
                  value={
                    stats.totalFeedbacks > 0
                      ? (stats.ratingDistribution[stars] /
                          stats.totalFeedbacks) *
                        100
                      : 0
                  }
                  sx={{
                    height: 8,
                    flexGrow: 1,
                    mx: 1,
                    bgcolor: 'grey.200',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: getRatingBarColor(stars),
                    },
                  }}
                />
                <Typography variant="body2" sx={{ minWidth: 30 }}>
                  {stats.ratingDistribution[stars]}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Paper>

      {/* Individual Feedback */}
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Recent Feedback
      </Typography>

      {feedbacks.length === 0 ? (
        <Paper elevation={1} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="textSecondary">
            No feedback received yet
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Feedback from patients will appear here once they start reviewing
            your services.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {feedbacks.map((feedback) => (
            <Grid item xs={12} key={feedback._id}>
              <Card elevation={2} sx={{ '&:hover': { elevation: 4 } }}>
                <CardContent>
                  <Box
                    sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: feedback.isAnonymous
                          ? 'grey.400'
                          : 'primary.main',
                      }}
                    >
                      {feedback.isAnonymous ? <PersonOff /> : <Person />}
                    </Avatar>

                    <Box sx={{ flexGrow: 1 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          mb: 1,
                        }}
                      >
                        <Typography variant="h6">
                          {feedback.patientName}
                        </Typography>
                        {feedback.isAnonymous && (
                          <Chip
                            label="Anonymous"
                            size="small"
                            color="default"
                            variant="outlined"
                          />
                        )}
                        <Typography variant="body2" color="textSecondary">
                          {formatDate(feedback.createdAt)}
                        </Typography>
                      </Box>

                      <Rating
                        value={feedback.rating}
                        readOnly
                        size="small"
                        sx={{ mb: 2 }}
                      />

                      <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                        {feedback.comment}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Statistics Summary */}
      {stats.totalFeedbacks > 0 && (
        <Paper elevation={1} sx={{ p: 3, mt: 4, bgcolor: 'grey.50' }}>
          <Typography variant="h6" gutterBottom>
            Summary Statistics
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="primary">
                  {stats.totalFeedbacks}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Total Reviews
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="success.main">
                  {stats.ratingDistribution[5] + stats.ratingDistribution[4]}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Positive Reviews
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="warning.main">
                  {Math.round((stats.averageRating / 5) * 100)}%
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Satisfaction Rate
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
          </Grid>
        </Paper>
      )}
    </Container>
  )
}

export default DoctorFeedback
